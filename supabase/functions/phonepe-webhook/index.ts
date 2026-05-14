import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import {
  fetchPhonePeOrderStatus,
  getPhonePeCheckoutSessionId,
  getPhonePeMerchantOrderId,
  getPhonePeProviderState,
  getPhonePeTransactionId,
  isPhonePePaymentSuccess,
  verifyPhonePeWebhookSignature,
  type PhonePeStatusPayload,
} from '../_shared/phonepe.ts'
import { finalizePaidCheckoutSession } from '../_shared/fulfillment.ts'

async function sha256Hex(value: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const rawBody = await request.text()
  const authorizationHeader = request.headers.get('authorization') ?? ''
  const signatureHeader = request.headers.get('x-verify') ?? request.headers.get('x-webhook-signature') ?? ''
  const payloadHash = await sha256Hex(rawBody)
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const rawPayload = JSON.parse(rawBody || '{}') as PhonePeStatusPayload
    const merchantOrderId = getPhonePeMerchantOrderId(rawPayload)
    const checkoutSessionIdFromPayload = getPhonePeCheckoutSessionId(rawPayload)
    const signature = await verifyPhonePeWebhookSignature(request.headers, rawBody)

    if (!signature.ok) {
      await serviceClient.from('phonepe_webhook_events').upsert({
        merchant_order_id: merchantOrderId || null,
        checkout_session_id: checkoutSessionIdFromPayload || null,
        payload_hash: payloadHash,
        signature_header: signatureHeader || null,
        authorization_header: authorizationHeader || null,
        status: 'invalid_signature',
        raw_payload: rawPayload,
        processing_error: 'Invalid PhonePe webhook signature.',
      }, { onConflict: 'payload_hash' })

      return jsonResponse({ error: 'Invalid PhonePe webhook signature.' }, 401)
    }

    const { data: existingEvent } = await serviceClient
      .from('phonepe_webhook_events')
      .select('id, status, order_id, retry_count')
      .eq('payload_hash', payloadHash)
      .maybeSingle()

    if (existingEvent?.status === 'processed') {
      return jsonResponse({ received: true, duplicate: true, orderId: existingEvent.order_id })
    }

    const { data: eventRow, error: eventError } = await serviceClient
      .from('phonepe_webhook_events')
      .upsert({
        id: existingEvent?.id,
        merchant_order_id: merchantOrderId || null,
        checkout_session_id: checkoutSessionIdFromPayload || null,
        payload_hash: payloadHash,
        signature_header: signatureHeader || null,
        authorization_header: authorizationHeader || null,
        status: 'received',
        retry_count: existingEvent?.retry_count ?? 0,
        locked_at: new Date().toISOString(),
        raw_payload: rawPayload,
        processing_error: null,
      }, { onConflict: 'payload_hash' })
      .select('*')
      .single()

    if (eventError) throw eventError
    if (!merchantOrderId) throw new Error('PhonePe webhook did not include merchant order id.')

    const { data: payment, error: paymentError } = await serviceClient
      .from('payments')
      .select('id, checkout_session_id, order_id, amount, attempt_count')
      .eq('merchant_order_id', merchantOrderId)
      .single()

    if (paymentError || !payment) throw new Error('Payment attempt not found for PhonePe webhook.')

    const statusCheck = await fetchPhonePeOrderStatus(merchantOrderId)
    const statusPayload = statusCheck.payload
    const success = statusCheck.ok && isPhonePePaymentSuccess(statusPayload)
    const checkoutSessionId = String(payment.checkout_session_id || checkoutSessionIdFromPayload)
    const providerState = getPhonePeProviderState(statusPayload) || null

    await serviceClient
      .from('payments')
      .update({
        status: success ? 'success' : 'failed',
        provider_transaction_id: getPhonePeTransactionId(statusPayload) || null,
        provider_state: providerState,
        raw_response: { webhook: rawPayload, status: statusPayload },
        verified_at: new Date().toISOString(),
        attempt_count: Number(payment.attempt_count ?? 0) + 1,
        last_error: success ? null : providerState || 'Payment was not successful.',
      })
      .eq('id', payment.id)

    if (!success) {
      await serviceClient.from('checkout_sessions').update({ status: 'payment_failed' }).eq('id', checkoutSessionId)
      await serviceClient
        .from('phonepe_webhook_events')
        .update({
          status: 'processed',
          checkout_session_id: checkoutSessionId,
          processed_at: new Date().toISOString(),
          locked_at: null,
        })
        .eq('id', eventRow.id)

      return jsonResponse({ received: true, success: false })
    }

    await serviceClient.from('checkout_sessions').update({ status: 'paid' }).eq('id', checkoutSessionId)
    const orderId = payment.order_id || await finalizePaidCheckoutSession(
      serviceClient,
      checkoutSessionId,
      merchantOrderId,
      'phonepe_webhook',
    )

    await serviceClient
      .from('phonepe_webhook_events')
      .update({
        status: 'processed',
        checkout_session_id: checkoutSessionId,
        order_id: orderId,
        processed_at: new Date().toISOString(),
        locked_at: null,
      })
      .eq('id', eventRow.id)

    return jsonResponse({ received: true, success: true, orderId })
  } catch (error) {
    const { data: event } = await serviceClient
      .from('phonepe_webhook_events')
      .select('retry_count')
      .eq('payload_hash', payloadHash)
      .maybeSingle()
    const retryCount = Number(event?.retry_count ?? 0) + 1

    await serviceClient
      .from('phonepe_webhook_events')
      .update({
        status: 'failed',
        retry_count: retryCount,
        next_retry_at: new Date(Date.now() + Math.min(retryCount, 6) * 10 * 60 * 1000).toISOString(),
        locked_at: null,
        processing_error: error.message ?? 'PhonePe webhook processing failed.',
      })
      .eq('payload_hash', payloadHash)

    return jsonResponse({ error: error.message ?? 'PhonePe webhook processing failed.' }, 500)
  }
})
