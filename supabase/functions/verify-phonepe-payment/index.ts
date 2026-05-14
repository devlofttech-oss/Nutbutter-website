import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import {
  fetchPhonePeOrderStatus,
  getPhonePeProviderState,
  getPhonePeTransactionId,
  isPhonePePaymentSuccess,
} from '../_shared/phonepe.ts'
import { finalizePaidCheckoutSession } from '../_shared/fulfillment.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const { checkoutSessionId, orderId, merchantOrderId } = await request.json()
    const sessionId = checkoutSessionId ?? orderId

    if (!authHeader || !sessionId || !merchantOrderId) {
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

    const { data: session, error: sessionError } = await serviceClient
      .from('checkout_sessions')
      .select('id, user_id, converted_order_id')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session || session.user_id !== user.id) {
      return jsonResponse({ error: 'Checkout session not found.' }, 404)
    }

    if (session.converted_order_id) {
      return jsonResponse({
        checkoutSessionId: sessionId,
        orderId: session.converted_order_id,
        merchantOrderId,
        success: true,
        duplicate: true,
        status: 'success',
      })
    }

    const statusCheck = await fetchPhonePeOrderStatus(merchantOrderId)
    const statusPayload = statusCheck.payload
    const success = statusCheck.ok && isPhonePePaymentSuccess(statusPayload)
    const providerTransactionId = getPhonePeTransactionId(statusPayload) || null
    const providerState = getPhonePeProviderState(statusPayload) || null

    const { data: payment, error: paymentError } = await serviceClient
      .from('payments')
      .update({
        status: success ? 'success' : 'failed',
        provider_transaction_id: providerTransactionId,
        provider_state: providerState,
        raw_response: statusPayload,
        verified_at: new Date().toISOString(),
        attempt_count: 1,
        last_error: success ? null : providerState || 'Payment was not successful.',
      })
      .eq('merchant_order_id', merchantOrderId)
      .eq('checkout_session_id', sessionId)
      .select('id')
      .maybeSingle()

    if (paymentError) throw paymentError
    if (!payment) return jsonResponse({ error: 'Payment attempt not found.' }, 404)

    if (!success) {
      await serviceClient
        .from('checkout_sessions')
        .update({ status: 'payment_failed' })
        .eq('id', sessionId)

      return jsonResponse({ checkoutSessionId: sessionId, merchantOrderId, success: false, status: 'failed' })
    }

    await serviceClient
      .from('checkout_sessions')
      .update({ status: 'paid' })
      .eq('id', sessionId)

    const confirmedOrderId = await finalizePaidCheckoutSession(
      serviceClient,
      String(sessionId),
      String(merchantOrderId),
      'payment_success_page',
    )

    await serviceClient.from('cart_items').delete().eq('user_id', user.id)

    return jsonResponse({
      checkoutSessionId: sessionId,
      orderId: confirmedOrderId,
      merchantOrderId,
      success: true,
      status: 'success',
    })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Payment verification failed.' }, 500)
  }
})
