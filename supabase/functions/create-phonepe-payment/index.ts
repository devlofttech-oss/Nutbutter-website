import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getPhonePeAccessToken, getPhonePeBaseUrl } from '../_shared/phonepe.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const { checkoutSessionId, orderId } = await request.json()
    const sessionId = checkoutSessionId ?? orderId

    if (!authHeader || !sessionId) {
      return jsonResponse({ error: 'Missing checkout session or authorization.' }, 400)
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
      .select('id, user_id, total_amount, currency, status, expires_at')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session || session.user_id !== user.id) {
      return jsonResponse({ error: 'Checkout session not found.' }, 404)
    }

    if (!['draft', 'payment_failed'].includes(session.status)) {
      return jsonResponse({ error: 'Checkout session is not payable.' }, 400)
    }

    if (new Date(session.expires_at).getTime() < Date.now()) {
      await serviceClient.from('checkout_sessions').update({ status: 'expired' }).eq('id', session.id)
      return jsonResponse({ error: 'Checkout session has expired. Please refresh shipping and try again.' }, 400)
    }

    const merchantOrderId = `SAT-${Date.now()}-${session.id.slice(0, 8).toUpperCase()}`
    const frontendUrl = Deno.env.get('FRONTEND_URL') ?? request.headers.get('Origin') ?? 'http://localhost:5173'
    const redirectUrl = `${frontendUrl}/payment/success?checkout_session_id=${session.id}&merchant_order_id=${merchantOrderId}`
    const callbackUrl = Deno.env.get('PHONEPE_CALLBACK_URL')
    const amountPaise = Math.round(Number(session.total_amount) * 100)
    const requestBody = {
      merchantOrderId,
      amount: amountPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: session.id,
        udf2: user.id,
      },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment for Satvegik order',
        merchantUrls: {
          redirectUrl,
          ...(callbackUrl ? { callbackUrl } : {}),
        },
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
      checkout_session_id: session.id,
      provider: 'phonepe',
      merchant_order_id: merchantOrderId,
      amount: session.total_amount,
      currency: session.currency,
      status: phonePeResponse.ok ? 'pending' : 'failed',
      payment_url: paymentUrl ?? null,
      raw_request: requestBody,
      raw_response: phonePePayload,
    })

    await serviceClient
      .from('checkout_sessions')
      .update({ status: phonePeResponse.ok ? 'payment_pending' : 'payment_failed' })
      .eq('id', session.id)

    if (!phonePeResponse.ok || !paymentUrl) {
      return jsonResponse({ error: 'PhonePe payment could not be created.' }, 502)
    }

    return jsonResponse({ checkoutSessionId: session.id, merchantOrderId, redirectUrl: paymentUrl })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Payment creation failed.' }, 500)
  }
})
