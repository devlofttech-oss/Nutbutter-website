import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { trackShiprocketAwb } from '../_shared/shiprocket.ts'

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
    await serviceClient
      .from('shipments')
      .update({
        tracking_response: tracking,
        last_tracked_at: new Date().toISOString(),
      })
      .eq('id', shipment.id)

    return jsonResponse({ shipment, tracking })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Shipment tracking failed.' }, 500)
  }
})
