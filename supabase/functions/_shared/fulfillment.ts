import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { queueAndSendEmail, renderOrderConfirmationEmail, renderShippingConfirmationEmail } from './email.ts'
import { assignShiprocketAwb, createShiprocketOrder, getShiprocketPickupLocation, shouldAssignShiprocketAwb } from './shiprocket.ts'

export const ORDER_DETAIL_COLUMNS = `
  *,
  order_items (*),
  shipping_address:shipping_address_id (*),
  billing_address:billing_address_id (*),
  shipments (*),
  order_timeline_events (*)
`

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return {
    firstName: parts[0] || fullName,
    lastName: parts.slice(1).join(' ') || '-',
  }
}

function getShipmentValue(payload: Record<string, unknown>, key: string) {
  const response = payload.response as Record<string, unknown> | undefined
  const data = response?.data as Record<string, unknown> | undefined
  return payload[key] ?? data?.[key]
}

export async function addTimelineEvent(
  serviceClient: SupabaseClient,
  orderId: string,
  status: string,
  label: string,
  description?: string,
  metadata: Record<string, unknown> = {},
) {
  await serviceClient.rpc('add_order_timeline_event', {
    p_order_id: orderId,
    p_status: status,
    p_label: label,
    p_description: description ?? null,
    p_metadata: metadata,
  })
}

export async function fetchOrderDetails(serviceClient: SupabaseClient, orderId: string) {
  const { data, error } = await serviceClient
    .from('orders')
    .select(ORDER_DETAIL_COLUMNS)
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data as Record<string, unknown>
}

export async function sendOrderConfirmationEmail(serviceClient: SupabaseClient, orderId: string) {
  const order = await fetchOrderDetails(serviceClient, orderId)
  const html = renderOrderConfirmationEmail(order)

  return queueAndSendEmail(serviceClient, {
    eventType: 'order_confirmation',
    dedupeKey: `order_confirmation:${orderId}`,
    to: String(order.customer_email),
    subject: `Satvegik order ${String(order.order_number)} is confirmed`,
    html,
    text: `Your Satvegik order ${String(order.order_number)} is confirmed.`,
    payload: { orderId },
  })
}

async function sendShippingConfirmationEmail(serviceClient: SupabaseClient, orderId: string, shipment: Record<string, unknown>) {
  const order = await fetchOrderDetails(serviceClient, orderId)
  const html = renderShippingConfirmationEmail(order, shipment)

  return queueAndSendEmail(serviceClient, {
    eventType: 'shipping_confirmation',
    dedupeKey: `shipping_confirmation:${orderId}:${String(shipment.awb_code ?? shipment.id)}`,
    to: String(order.customer_email),
    subject: `Satvegik order ${String(order.order_number)} is on the way`,
    html,
    text: `Your Satvegik order ${String(order.order_number)} has shipped. Tracking: ${String(shipment.awb_code ?? '')}`,
    payload: { orderId, shipmentId: shipment.id },
  })
}

export async function finalizePaidCheckoutSession(
  serviceClient: SupabaseClient,
  checkoutSessionId: string,
  merchantOrderId: string,
  source: string,
) {
  const { data: orderId, error } = await serviceClient.rpc('finalize_paid_checkout_session', {
    p_checkout_session_id: checkoutSessionId,
    p_merchant_order_id: merchantOrderId,
    p_source: source,
  })

  if (error) throw error

  await sendOrderConfirmationEmail(serviceClient, String(orderId))
  await syncShiprocketShipment(serviceClient, String(orderId))

  return String(orderId)
}

export async function syncShiprocketShipment(serviceClient: SupabaseClient, orderId: string) {
  const order = await fetchOrderDetails(serviceClient, orderId)
  const existingShipment = ((order.shipments ?? []) as Array<Record<string, unknown>>)[0]

  if (existingShipment?.awb_code) {
    return existingShipment
  }

  const shippingAddress = order.shipping_address as Record<string, unknown>
  const billingAddress = order.billing_address as Record<string, unknown>
  const items = (order.order_items ?? []) as Array<Record<string, unknown>>
  const billingName = splitName(String(billingAddress.full_name))
  const shippingName = splitName(String(shippingAddress.full_name))
  const weightKg = Math.max(
    items.reduce((sum, item) => sum + (Number(item.weight_grams ?? 500) * Number(item.quantity ?? 1)) / 1000, 0),
    Number(Deno.env.get('SHIPROCKET_DEFAULT_WEIGHT_KG') ?? '0.5'),
  )
  const requestBody = {
    order_id: order.order_number,
    order_date: new Date().toISOString().slice(0, 10),
    pickup_location: getShiprocketPickupLocation(),
    channel_id: Deno.env.get('SHIPROCKET_CHANNEL_ID') || '',
    billing_customer_name: billingName.firstName,
    billing_last_name: billingName.lastName,
    billing_address: billingAddress.address_line1,
    billing_address_2: billingAddress.address_line2 || '',
    billing_city: billingAddress.city,
    billing_pincode: billingAddress.pincode,
    billing_state: billingAddress.state,
    billing_country: billingAddress.country || 'India',
    billing_email: billingAddress.email,
    billing_phone: billingAddress.phone,
    shipping_is_billing: Boolean(order.billing_same_as_shipping),
    shipping_customer_name: shippingName.firstName,
    shipping_last_name: shippingName.lastName,
    shipping_address: shippingAddress.address_line1,
    shipping_address_2: shippingAddress.address_line2 || '',
    shipping_city: shippingAddress.city,
    shipping_pincode: shippingAddress.pincode,
    shipping_state: shippingAddress.state,
    shipping_country: shippingAddress.country || 'India',
    shipping_email: shippingAddress.email,
    shipping_phone: shippingAddress.phone,
    order_items: items.map((item) => ({
      name: item.product_name,
      sku: item.sku || item.product_slug || item.product_id,
      units: item.quantity,
      selling_price: item.unit_price,
      discount: 0,
      tax: 0,
    })),
    payment_method: 'Prepaid',
    shipping_charges: order.shipping_amount,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: order.discount_amount,
    sub_total: order.subtotal,
    length: Number(Deno.env.get('SHIPROCKET_PACKAGE_LENGTH_CM') ?? '12'),
    breadth: Number(Deno.env.get('SHIPROCKET_PACKAGE_BREADTH_CM') ?? '12'),
    height: Number(Deno.env.get('SHIPROCKET_PACKAGE_HEIGHT_CM') ?? '8'),
    weight: weightKg,
  }

  const { data: shipment, error: shipmentError } = existingShipment?.id
    ? await serviceClient
      .from('shipments')
      .update({
        status: existingShipment.status === 'failed' ? 'pending' : existingShipment.status,
        raw_request: requestBody,
        retry_count: Number(existingShipment.retry_count ?? 0) + 1,
        last_sync_attempt_at: new Date().toISOString(),
        failure_reason: null,
      })
      .eq('id', existingShipment.id)
      .select('*')
      .single()
    : await serviceClient
      .from('shipments')
      .insert({
        order_id: order.id,
        provider: 'shiprocket',
        status: 'pending',
        courier_company_id: order.shiprocket_courier_id,
        courier_name: order.shiprocket_courier_name,
        estimated_delivery_date: order.estimated_delivery_date,
        freight_charge: order.shipping_amount,
        raw_request: requestBody,
        retry_count: 0,
        last_sync_attempt_at: new Date().toISOString(),
      })
      .select('*')
      .single()

  if (shipmentError) throw shipmentError

  try {
    const shiprocketOrder = await createShiprocketOrder(requestBody)
    const shiprocketOrderId = getShipmentValue(shiprocketOrder, 'order_id') ?? getShipmentValue(shiprocketOrder, 'id')
    const shiprocketShipmentId = getShipmentValue(shiprocketOrder, 'shipment_id')

    await serviceClient
      .from('shipments')
      .update({
        status: 'synced',
        shiprocket_order_id: shiprocketOrderId ? String(shiprocketOrderId) : shipment.shiprocket_order_id,
        shiprocket_shipment_id: shiprocketShipmentId ? String(shiprocketShipmentId) : shipment.shiprocket_shipment_id,
        raw_response: shiprocketOrder,
        synced_at: new Date().toISOString(),
        failure_reason: null,
        next_retry_at: null,
      })
      .eq('id', shipment.id)

    const shipmentIdForAwb = shiprocketShipmentId ?? shipment.shiprocket_shipment_id
    if (!shipmentIdForAwb) return shipment

    if (!shouldAssignShiprocketAwb()) {
      return {
        ...shipment,
        status: 'synced',
        shiprocket_order_id: shiprocketOrderId ? String(shiprocketOrderId) : shipment.shiprocket_order_id,
        shiprocket_shipment_id: String(shipmentIdForAwb),
        raw_response: shiprocketOrder,
      }
    }

    const awbResponse = await assignShiprocketAwb(String(shipmentIdForAwb), Number(order.shiprocket_courier_id) || null)
    const awbCode = getShipmentValue(awbResponse, 'awb_code')
    const courierName = getShipmentValue(awbResponse, 'courier_name') ?? order.shiprocket_courier_name
    const trackingUrl = awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null
    const { data: updatedShipment, error: updateError } = await serviceClient
      .from('shipments')
      .update({
        status: awbCode ? 'awb_assigned' : 'synced',
        awb_code: awbCode ? String(awbCode) : shipment.awb_code,
        courier_name: courierName ? String(courierName) : shipment.courier_name,
        tracking_url: trackingUrl,
        raw_response: { shiprocketOrder, awbResponse },
        awb_assigned_at: awbCode ? new Date().toISOString() : shipment.awb_assigned_at,
        failure_reason: null,
        next_retry_at: null,
      })
      .eq('id', shipment.id)
      .select('*')
      .single()

    if (updateError) throw updateError

    if (awbCode) {
      await addTimelineEvent(serviceClient, String(order.id), 'shipped', 'Shipped', 'Your order has been handed to the courier.', {
        shiprocketOrderId,
        shiprocketShipmentId,
        awbCode,
      })
      await sendShippingConfirmationEmail(serviceClient, String(order.id), updatedShipment)
    }

    return updatedShipment
  } catch (error) {
    const retryCount = Number(shipment.retry_count ?? 0) + 1
    await serviceClient
      .from('shipments')
      .update({
        status: 'failed',
        retry_count: retryCount,
        failure_reason: error.message ?? 'Shiprocket sync failed.',
        raw_response: { error: error.message ?? 'Shiprocket sync failed.' },
        next_retry_at: new Date(Date.now() + Math.min(retryCount, 6) * 10 * 60 * 1000).toISOString(),
      })
      .eq('id', shipment.id)

    return shipment
  }
}

