import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getPhonePeAccessToken, getPhonePeBaseUrl } from '../_shared/phonepe.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const { orderId } = await request.json()

    if (!authHeader || !orderId) {
      return jsonResponse({ error: 'Missing order or authorization.' }, 400)
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
      .select('id, order_number, user_id, total_amount, currency, status')
      .eq('id', orderId)
      .single()

    if (orderError || !order || order.user_id !== user.id) {
      return jsonResponse({ error: 'Order not found.' }, 404)
    }

    if (order.status !== 'pending_payment') {
      return jsonResponse({ error: 'Order is not payable.' }, 400)
    }

    const merchantOrderId = `ANC-${order.order_number}-${Date.now()}`
    const frontendUrl = Deno.env.get('FRONTEND_URL') ?? request.headers.get('Origin') ?? 'http://localhost:5173'
    const redirectUrl = `${frontendUrl}/payment/success?order_id=${order.id}&merchant_order_id=${merchantOrderId}`
    const amountPaise = Math.round(Number(order.total_amount) * 100)
    const requestBody = {
      merchantOrderId,
      amount: amountPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: order.id,
        udf2: order.order_number,
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Payment for ${order.order_number}`,
        merchantUrls: { redirectUrl },
      },
    }

    const token = await getPhonePeAccessToken()
    const phonePeResponse = await fetch(`${getPhonePeBaseUrl()}/checkout/v2/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
    const phonePePayload = await phonePeResponse.json()
    const paymentUrl = phonePePayload?.redirectUrl ?? phonePePayload?.data?.instrumentResponse?.redirectInfo?.url

    await serviceClient.from('payments').insert({
      order_id: order.id,
      provider: 'phonepe',
      merchant_order_id: merchantOrderId,
      amount: order.total_amount,
      currency: order.currency,
      status: phonePeResponse.ok ? 'pending' : 'failed',
      payment_url: paymentUrl ?? null,
      raw_request: requestBody,
      raw_response: phonePePayload,
    })

    if (!phonePeResponse.ok || !paymentUrl) {
      return jsonResponse({ error: 'PhonePe payment could not be created.' }, 502)
    }

    return jsonResponse({ orderId: order.id, merchantOrderId, redirectUrl: paymentUrl })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Payment creation failed.' }, 500)
  }
})

