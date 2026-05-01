import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getPhonePeAccessToken, getPhonePeBaseUrl } from '../_shared/phonepe.ts'

function isSuccess(payload: Record<string, unknown>) {
  const state = String(payload.state ?? payload.status ?? payload.code ?? '').toUpperCase()
  return ['COMPLETED', 'SUCCESS', 'PAYMENT_SUCCESS'].includes(state)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const { orderId, merchantOrderId } = await request.json()

    if (!authHeader || !orderId || !merchantOrderId) {
      return jsonResponse({ error: 'Missing verification details.' }, 400)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return jsonResponse({ error: 'Authentication required.' }, 401)

    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('id, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order || order.user_id !== user.id) {
      return jsonResponse({ error: 'Order not found.' }, 404)
    }

    const token = await getPhonePeAccessToken()
    const statusResponse = await fetch(`${getPhonePeBaseUrl()}/checkout/v2/order/${merchantOrderId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
    })
    const statusPayload = await statusResponse.json()
    const success = statusResponse.ok && isSuccess(statusPayload)
    const paymentStatus = success ? 'success' : 'failed'

    await serviceClient
      .from('payments')
      .update({
        status: paymentStatus,
        raw_response: statusPayload,
        verified_at: new Date().toISOString(),
      })
      .eq('merchant_order_id', merchantOrderId)

    await serviceClient
      .from('orders')
      .update({
        status: success ? 'paid' : 'payment_failed',
        payment_status: success ? 'paid' : 'failed',
      })
      .eq('id', orderId)

    if (success) {
      await serviceClient.from('cart_items').delete().eq('user_id', user.id)
    }

    return jsonResponse({ orderId, merchantOrderId, success, status: paymentStatus })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Payment verification failed.' }, 500)
  }
})
