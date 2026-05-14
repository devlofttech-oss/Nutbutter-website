import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import {
  fetchPhonePeOrderStatus,
  getPhonePeProviderState,
  getPhonePeTransactionId,
  isPhonePePaymentSuccess,
} from '../_shared/phonepe.ts'
import { finalizePaidCheckoutSession, syncShiprocketShipment } from '../_shared/fulfillment.ts'
import { queueAndSendEmail } from '../_shared/email.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret && request.headers.get('x-cron-secret') !== cronSecret) {
    return jsonResponse({ error: 'Unauthorized.' }, 401)
  }

  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
  const now = new Date().toISOString()
  const results = {
    phonepe: { processed: 0, failed: 0 },
    shiprocket: { processed: 0, failed: 0 },
    email: { processed: 0, failed: 0 },
  }

  const { data: failedEvents } = await serviceClient
    .from('phonepe_webhook_events')
    .select('id, merchant_order_id, checkout_session_id, retry_count')
    .eq('status', 'failed')
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .limit(10)

  for (const event of failedEvents ?? []) {
    try {
      if (!event.merchant_order_id) throw new Error('Missing merchant order id.')

      const { data: payment, error: paymentError } = await serviceClient
        .from('payments')
        .select('id, checkout_session_id, attempt_count')
        .eq('merchant_order_id', event.merchant_order_id)
        .single()

      if (paymentError || !payment) throw new Error('Payment attempt not found.')

      const statusCheck = await fetchPhonePeOrderStatus(event.merchant_order_id)
      const success = statusCheck.ok && isPhonePePaymentSuccess(statusCheck.payload)
      const checkoutSessionId = String(payment.checkout_session_id || event.checkout_session_id)

      await serviceClient
        .from('payments')
        .update({
          status: success ? 'success' : 'failed',
          provider_transaction_id: getPhonePeTransactionId(statusCheck.payload) || null,
          provider_state: getPhonePeProviderState(statusCheck.payload) || null,
          raw_response: statusCheck.payload,
          verified_at: now,
          attempt_count: Number(payment.attempt_count ?? 0) + 1,
        })
        .eq('id', payment.id)

      if (!success) throw new Error(getPhonePeProviderState(statusCheck.payload) || 'Payment is not successful.')

      await serviceClient.from('checkout_sessions').update({ status: 'paid' }).eq('id', checkoutSessionId)
      const orderId = await finalizePaidCheckoutSession(serviceClient, checkoutSessionId, event.merchant_order_id, 'retry_worker')
      await serviceClient
        .from('phonepe_webhook_events')
        .update({ status: 'processed', order_id: orderId, processed_at: now, processing_error: null, next_retry_at: null })
        .eq('id', event.id)

      results.phonepe.processed += 1
    } catch (error) {
      const retryCount = Number(event.retry_count ?? 0) + 1
      await serviceClient
        .from('phonepe_webhook_events')
        .update({
          retry_count: retryCount,
          processing_error: error.message ?? 'Retry failed.',
          next_retry_at: new Date(Date.now() + Math.min(retryCount, 6) * 10 * 60 * 1000).toISOString(),
        })
        .eq('id', event.id)

      results.phonepe.failed += 1
    }
  }

  const { data: failedShipments } = await serviceClient
    .from('shipments')
    .select('id, order_id, retry_count')
    .eq('status', 'failed')
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .limit(10)

  for (const shipment of failedShipments ?? []) {
    try {
      await syncShiprocketShipment(serviceClient, String(shipment.order_id))
      results.shiprocket.processed += 1
    } catch (error) {
      const retryCount = Number(shipment.retry_count ?? 0) + 1
      await serviceClient
        .from('shipments')
        .update({
          retry_count: retryCount,
          failure_reason: error.message ?? 'Shipment retry failed.',
          next_retry_at: new Date(Date.now() + Math.min(retryCount, 6) * 10 * 60 * 1000).toISOString(),
        })
        .eq('id', shipment.id)

      results.shiprocket.failed += 1
    }
  }

  const { data: failedEmails } = await serviceClient
    .from('email_events')
    .select('*')
    .eq('status', 'failed')
    .or(`next_retry_at.is.null,next_retry_at.lte.${now}`)
    .limit(20)

  for (const event of failedEmails ?? []) {
    try {
      await queueAndSendEmail(serviceClient, {
        eventType: event.event_type,
        dedupeKey: event.dedupe_key,
        to: event.recipient,
        subject: event.subject,
        html: event.payload?.html ?? '',
        text: event.payload?.text ?? '',
        payload: event.payload ?? {},
      })
      results.email.processed += 1
    } catch (_error) {
      results.email.failed += 1
    }
  }

  return jsonResponse({ ok: true, results })
})
