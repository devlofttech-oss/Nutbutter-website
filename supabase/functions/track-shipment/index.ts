import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { addTimelineEvent } from '../_shared/fulfillment.ts'
import { trackShiprocketAwb } from '../_shared/shiprocket.ts'

function getTrackingStatus(payload: Record<string, unknown>) {
  const trackingData = payload.tracking_data as Record<string, unknown> | undefined
  const shipmentTrack = trackingData?.shipment_track as Array<Record<string, unknown>> | undefined
  const current = shipmentTrack?.[0] ?? trackingData ?? payload
  const status = String(current.current_status ?? current.shipment_status ?? current.status ?? '').toLowerCase()

  if (status.includes('delivered')) return 'delivered'
  if (status.includes('out for delivery') || status.includes('ofd')) return 'out_for_delivery'
  if (status.includes('transit') || status.includes('shipped') || status.includes('pickup')) return 'in_transit'

  return ''
}

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
      .select('id, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order || order.user_id !== user.id) {
      return jsonResponse({ error: 'Order not found.' }, 404)
    }

    const { data: shipment, error: shipmentError } = await serviceClient
      .from('shipments')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle()

    if (shipmentError) throw shipmentError
    if (!shipment) return jsonResponse({ error: 'Shipment has not been created yet.' }, 404)
    if (!shipment.awb_code) return jsonResponse({ shipment, tracking: null })

    const tracking = await trackShiprocketAwb(shipment.awb_code)
    const nextStatus = getTrackingStatus(tracking)
    await serviceClient
      .from('shipments')
      .update({
        ...(nextStatus ? { status: nextStatus } : {}),
        tracking_response: tracking,
        last_tracked_at: new Date().toISOString(),
        failure_reason: null,
      })
      .eq('id', shipment.id)

    if (nextStatus === 'out_for_delivery') {
      await addTimelineEvent(serviceClient, orderId, 'out_for_delivery', 'Out For Delivery', 'Your order is out for delivery.', { awbCode: shipment.awb_code })
    }

    if (nextStatus === 'delivered') {
      await addTimelineEvent(serviceClient, orderId, 'delivered', 'Delivered', 'Your order has been delivered.', { awbCode: shipment.awb_code })
      await serviceClient.from('orders').update({ status: 'delivered' }).eq('id', orderId)
    }

    return jsonResponse({ shipment, tracking })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Shipment tracking failed.' }, 500)
  }
})
