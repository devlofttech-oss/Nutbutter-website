import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getPhonePeAccessToken, getPhonePeBaseUrl } from '../_shared/phonepe.ts'
import { assignShiprocketAwb, createShiprocketOrder, getShiprocketPickupLocation } from '../_shared/shiprocket.ts'

type PaymentStatusPayload = Record<string, unknown> & {
  state?: string
  status?: string
  code?: string
  transactionId?: string
  paymentDetails?: Array<Record<string, unknown>>
}

function isSuccess(payload: PaymentStatusPayload) {
  const state = String(payload.state ?? payload.status ?? payload.code ?? '').toUpperCase()
  return ['COMPLETED', 'SUCCESS', 'PAYMENT_SUCCESS'].includes(state)
}

function createOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const random = crypto.randomUUID().slice(0, 8).toUpperCase()
  return `SAT-${stamp}-${random}`
}

function money(value: unknown) {
  return Math.round(Number(value ?? 0) * 100) / 100
}

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

async function createOrderFromSession(serviceClient: ReturnType<typeof createClient>, sessionId: string, merchantOrderId: string) {
  const { data: session, error: sessionError } = await serviceClient
    .from('checkout_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) throw new Error('Checkout session not found.')
  if (session.converted_order_id) return session.converted_order_id as string

  const [{ data: shippingAddress, error: shippingError }, { data: billingAddress, error: billingError }, { data: sessionItems, error: itemsError }] = await Promise.all([
    serviceClient.from('addresses').select('*').eq('id', session.shipping_address_id).single(),
    serviceClient.from('addresses').select('*').eq('id', session.billing_address_id).single(),
    serviceClient.from('checkout_session_items').select('*').eq('checkout_session_id', session.id),
  ])

  if (shippingError || !shippingAddress) throw new Error('Shipping address not found.')
  if (billingError || !billingAddress) throw new Error('Billing address not found.')
  if (itemsError || !sessionItems || sessionItems.length === 0) throw new Error('Checkout items not found.')

  const orderNumber = createOrderNumber()
  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: session.user_id,
      checkout_session_id: session.id,
      shipping_address_id: shippingAddress.id,
      billing_address_id: billingAddress.id,
      customer_email: session.customer_email,
      customer_phone: session.customer_phone,
      status: 'paid',
      payment_status: 'paid',
      subtotal: session.subtotal,
      shipping_amount: session.shipping_amount,
      tax_amount: session.tax_amount,
      discount_amount: session.discount_amount,
      total_amount: session.total_amount,
      currency: session.currency,
      delivery_method: session.shipping_method,
      billing_same_as_shipping: session.billing_same_as_shipping,
      shiprocket_courier_id: session.shiprocket_courier_id,
      shiprocket_courier_name: session.shiprocket_courier_name,
      estimated_delivery_date: session.estimated_delivery_date,
      metadata: {
        checkoutSessionId: session.id,
        merchantOrderId,
      },
    })
    .select('*')
    .single()

  if (orderError) throw orderError

  const orderItems = sessionItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_slug: item.product_slug,
    variant_label: item.variant_label,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.line_total,
    image_url: item.image_url,
  }))
  const { error: orderItemsError } = await serviceClient.from('order_items').insert(orderItems)
  if (orderItemsError) throw orderItemsError

  await serviceClient
    .from('payments')
    .update({ order_id: order.id })
    .eq('merchant_order_id', merchantOrderId)

  await serviceClient
    .from('checkout_sessions')
    .update({ status: 'converted', converted_order_id: order.id })
    .eq('id', session.id)

  await syncShiprocketShipment(serviceClient, order, shippingAddress, billingAddress, sessionItems, session)

  return order.id as string
}

async function syncShiprocketShipment(
  serviceClient: ReturnType<typeof createClient>,
  order: Record<string, unknown>,
  shippingAddress: Record<string, unknown>,
  billingAddress: Record<string, unknown>,
  items: Array<Record<string, unknown>>,
  session: Record<string, unknown>,
) {
  const { firstName, lastName } = splitName(String(billingAddress.full_name))
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
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: billingAddress.address_line1,
    billing_address_2: billingAddress.address_line2 || '',
    billing_city: billingAddress.city,
    billing_pincode: billingAddress.pincode,
    billing_state: billingAddress.state,
    billing_country: billingAddress.country || 'India',
    billing_email: billingAddress.email,
    billing_phone: billingAddress.phone,
    shipping_is_billing: Boolean(session.billing_same_as_shipping),
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

  const { data: shipment, error: shipmentError } = await serviceClient
    .from('shipments')
    .insert({
      order_id: order.id,
      provider: 'shiprocket',
      status: 'pending',
      courier_company_id: session.shiprocket_courier_id,
      courier_name: session.shiprocket_courier_name,
      estimated_delivery_date: session.estimated_delivery_date,
      freight_charge: session.shipping_amount,
      raw_request: requestBody,
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
        shiprocket_order_id: shiprocketOrderId ? String(shiprocketOrderId) : null,
        shiprocket_shipment_id: shiprocketShipmentId ? String(shiprocketShipmentId) : null,
        raw_response: shiprocketOrder,
        synced_at: new Date().toISOString(),
      })
      .eq('id', shipment.id)

    if (!shiprocketShipmentId) return

    const awbResponse = await assignShiprocketAwb(String(shiprocketShipmentId), Number(session.shiprocket_courier_id) || null)
    const awbCode = getShipmentValue(awbResponse, 'awb_code')
    const courierName = getShipmentValue(awbResponse, 'courier_name') ?? session.shiprocket_courier_name

    await serviceClient
      .from('shipments')
      .update({
        status: awbCode ? 'awb_assigned' : 'synced',
        awb_code: awbCode ? String(awbCode) : null,
        courier_name: courierName ? String(courierName) : null,
        tracking_url: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null,
        raw_response: {
          shiprocketOrder,
          awbResponse,
        },
        awb_assigned_at: awbCode ? new Date().toISOString() : null,
      })
      .eq('id', shipment.id)
  } catch (error) {
    await serviceClient
      .from('shipments')
      .update({
        status: 'failed',
        raw_response: { error: error.message ?? 'Shiprocket sync failed.' },
      })
      .eq('id', shipment.id)
  }
}

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
      .select('id, user_id')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session || session.user_id !== user.id) {
      return jsonResponse({ error: 'Checkout session not found.' }, 404)
    }

    const token = await getPhonePeAccessToken()
    const statusResponse = await fetch(`${getPhonePeBaseUrl()}/checkout/v2/order/${merchantOrderId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
    })
    const statusPayload = await statusResponse.json().catch(() => ({})) as PaymentStatusPayload
    const success = statusResponse.ok && isSuccess(statusPayload)
    const providerTransactionId = statusPayload.transactionId
      ?? statusPayload.paymentDetails?.[0]?.transactionId
      ?? statusPayload.paymentDetails?.[0]?.paymentId
      ?? null
    const providerState = String(statusPayload.state ?? statusPayload.status ?? statusPayload.code ?? '').toUpperCase()

    await serviceClient
      .from('payments')
      .update({
        status: success ? 'success' : 'failed',
        provider_transaction_id: providerTransactionId ? String(providerTransactionId) : null,
        provider_state: providerState || null,
        raw_response: statusPayload,
        verified_at: new Date().toISOString(),
      })
      .eq('merchant_order_id', merchantOrderId)

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

    const confirmedOrderId = await createOrderFromSession(serviceClient, sessionId, merchantOrderId)
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
