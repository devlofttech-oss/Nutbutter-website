import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getDefaultPackageWeightKg, getServiceabilityEstimate } from '../_shared/shiprocket.ts'

function isFreeShippingEnabled() {
  return ['1', 'true', 'yes', 'on'].includes(String(Deno.env.get('FREE_SHIPPING_ENABLED') ?? '').toLowerCase())
}

function applyFreeShipping(couriers: Array<Record<string, unknown>>, enabled: boolean) {
  if (!enabled) return couriers

  return couriers.map((courier) => ({
    ...courier,
    actualFreightCharge: courier.freightCharge,
    freightCharge: 0,
    freeShippingApplied: true,
  }))
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const { pincode } = await request.json()

    if (!authHeader) return jsonResponse({ error: 'Authentication required.' }, 401)
    if (!/^\d{6}$/.test(String(pincode ?? ''))) {
      return jsonResponse({ error: 'Enter a valid 6 digit pincode.' }, 400)
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

    const { data: cartRows, error: cartError } = await serviceClient
      .from('cart_items')
      .select(`
        quantity,
        products:product_id (
          price,
          sale_price,
          weight_grams,
          is_active
        )
      `)
      .eq('user_id', user.id)

    if (cartError) throw cartError
    if (!cartRows || cartRows.length === 0) throw new Error('Your cart is empty.')

    const subtotal = cartRows.reduce((sum, row) => {
      const product = row.products as { price?: number; sale_price?: number | null; is_active?: boolean } | null
      if (!product?.is_active) return sum
      return sum + Number(product.sale_price ?? product.price ?? 0) * Number(row.quantity ?? 0)
    }, 0)
    const totalWeightKg = Math.max(
      cartRows.reduce((sum, row) => {
        const product = row.products as { weight_grams?: number | null } | null
        return sum + (Number(product?.weight_grams ?? getDefaultPackageWeightKg() * 1000) * Number(row.quantity ?? 0)) / 1000
      }, 0),
      getDefaultPackageWeightKg(),
    )

    const prepaid = await getServiceabilityEstimate({
      deliveryPincode: String(pincode),
      cod: false,
      weightKg: totalWeightKg,
      orderAmount: subtotal,
    })
    const cod = await getServiceabilityEstimate({
      deliveryPincode: String(pincode),
      cod: true,
      weightKg: totalWeightKg,
      orderAmount: subtotal,
    }).catch(() => null)
    const couriers = applyFreeShipping(prepaid.couriers, isFreeShippingEnabled())

    return jsonResponse({
      pincode,
      couriers,
      recommendedCourier: couriers[0],
      codAvailable: Boolean(cod?.couriers?.some((courier) => courier.codAvailable)),
      package: { weightKg: totalWeightKg },
    })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Shipping estimate failed.' }, 500)
  }
})
