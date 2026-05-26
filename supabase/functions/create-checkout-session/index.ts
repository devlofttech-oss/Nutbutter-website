import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { getDefaultPackageWeightKg, getServiceabilityEstimate } from '../_shared/shiprocket.ts'

type CheckoutAddress = {
  fullName: string
  email: string
  phone: string
  address: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country?: string
}

type CartRow = {
  product_id: string
  variant_label: string
  quantity: number
  products: {
    id: string
    slug: string
    sku: string
    name: string
    price: number
    sale_price: number | null
    image_url: string
    weight_grams: number | null
    is_active: boolean
    stock_quantity: number
    metadata?: Record<string, unknown>
  }
}

const requiredAddressFields: Array<keyof CheckoutAddress> = [
  'fullName',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'pincode',
]

function isFreeShippingEnabled() {
  return ['1', 'true', 'yes', 'on'].includes(String(Deno.env.get('FREE_SHIPPING_ENABLED') ?? '').toLowerCase())
}

function assertAddress(address: CheckoutAddress, label: string) {
  const missingField = requiredAddressFields.find((field) => !String(address?.[field] ?? '').trim())
  if (missingField) throw new Error(`${label} ${missingField} is required.`)
  if (!/^\d{6}$/.test(String(address.pincode))) throw new Error(`${label} pincode must be 6 digits.`)
}

function money(value: number) {
  return Math.round(value * 100) / 100
}

function addDays(days: number | null) {
  if (!days) return null
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json()

    if (!authHeader) return jsonResponse({ error: 'Authentication required.' }, 401)

    const {
      shippingAddress,
      billingSameAsShipping = true,
      billingAddress,
      selectedCourierId,
    } = body as {
      shippingAddress: CheckoutAddress
      billingSameAsShipping?: boolean
      billingAddress?: CheckoutAddress
      selectedCourierId?: number
    }

    assertAddress(shippingAddress, 'Shipping')
    if (!billingSameAsShipping) assertAddress(billingAddress!, 'Billing')

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
        product_id,
        variant_label,
        quantity,
        products:product_id (
          id,
          slug,
          sku,
          name,
          price,
          sale_price,
          image_url,
          weight_grams,
          is_active,
          stock_quantity,
          metadata
        )
      `)
      .eq('user_id', user.id)

    if (cartError) throw cartError
    if (!cartRows || cartRows.length === 0) throw new Error('Your cart is empty.')

    const normalizedItems = (cartRows as CartRow[]).map((row) => {
      const product = row.products
      if (!product?.is_active) throw new Error(`${product?.name ?? 'A product'} is no longer available.`)
      if (product.stock_quantity < row.quantity) throw new Error(`${product.name} does not have enough stock.`)

      const unitPrice = Number(product.sale_price ?? product.price ?? 0)
      const quantity = Number(row.quantity)
      const weightGrams = Number(product.weight_grams ?? getDefaultPackageWeightKg() * 1000)

      return {
        product,
        variantLabel: row.variant_label,
        quantity,
        unitPrice,
        lineTotal: money(unitPrice * quantity),
        weightGrams,
      }
    })

    const subtotal = money(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0))
    const totalWeightKg = Math.max(
      normalizedItems.reduce((sum, item) => sum + (item.weightGrams * item.quantity) / 1000, 0),
      getDefaultPackageWeightKg(),
    )

    const serviceability = await getServiceabilityEstimate({
      deliveryPincode: shippingAddress.pincode,
      cod: false,
      weightKg: totalWeightKg,
      orderAmount: subtotal,
    })
    const selectedCourier = serviceability.couriers.find((courier) => courier.courierId === Number(selectedCourierId))
      ?? serviceability.couriers[0]
    const codQuote = await getServiceabilityEstimate({
      deliveryPincode: shippingAddress.pincode,
      cod: true,
      weightKg: totalWeightKg,
      orderAmount: subtotal,
    }).catch(() => null)

    const freeShippingEnabled = isFreeShippingEnabled()
    const actualShippingAmount = money(selectedCourier.freightCharge)
    const shippingAmount = freeShippingEnabled ? 0 : actualShippingAmount
    const selectedCourierForResponse = freeShippingEnabled
      ? {
          ...selectedCourier,
          actualFreightCharge: selectedCourier.freightCharge,
          freightCharge: 0,
          freeShippingApplied: true,
        }
      : selectedCourier
    const couriersForResponse = freeShippingEnabled
      ? serviceability.couriers.map((courier) => ({
          ...courier,
          actualFreightCharge: courier.freightCharge,
          freightCharge: 0,
          freeShippingApplied: true,
        }))
      : serviceability.couriers
    const discount = 0
    const tax = money(Math.round((subtotal - discount) * 0.05))
    const total = money(Math.max(subtotal - discount + shippingAmount + tax, 0))

    const { data: shippingAddressRow, error: shippingAddressError } = await serviceClient
      .from('addresses')
      .insert({
        user_id: user.id,
        full_name: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address_line1: shippingAddress.address,
        address_line2: shippingAddress.addressLine2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      })
      .select('*')
      .single()

    if (shippingAddressError) throw shippingAddressError

    let billingAddressRow = shippingAddressRow
    if (!billingSameAsShipping) {
      const { data, error } = await serviceClient
        .from('addresses')
        .insert({
          user_id: user.id,
          full_name: billingAddress!.fullName,
          email: billingAddress!.email,
          phone: billingAddress!.phone,
          address_line1: billingAddress!.address,
          address_line2: billingAddress!.addressLine2 || null,
          city: billingAddress!.city,
          state: billingAddress!.state,
          pincode: billingAddress!.pincode,
          country: billingAddress!.country || 'India',
        })
        .select('*')
        .single()

      if (error) throw error
      billingAddressRow = data
    }

    const { data: session, error: sessionError } = await serviceClient
      .from('checkout_sessions')
      .insert({
        user_id: user.id,
        shipping_address_id: shippingAddressRow.id,
        billing_address_id: billingAddressRow.id,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        subtotal,
        shipping_amount: shippingAmount,
        tax_amount: tax,
        discount_amount: discount,
        total_amount: total,
        billing_same_as_shipping: billingSameAsShipping,
        shiprocket_courier_id: selectedCourier.courierId,
        shiprocket_courier_name: selectedCourier.courierName,
        cod_available: Boolean(codQuote?.couriers?.some((courier) => courier.codAvailable)),
        estimated_delivery_days: selectedCourier.estimatedDeliveryDays,
        estimated_delivery_date: selectedCourier.estimatedDeliveryDate ?? addDays(selectedCourier.estimatedDeliveryDays),
        shipping_quote: {
          selectedCourier: selectedCourierForResponse,
          serviceability: serviceability.raw,
          codServiceability: codQuote?.raw ?? null,
          freeShippingApplied: freeShippingEnabled,
          actualShippingAmount,
          package: { weightKg: totalWeightKg },
        },
      })
      .select('*')
      .single()

    if (sessionError) throw sessionError

    const sessionItems = normalizedItems.map((item) => ({
      checkout_session_id: session.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_slug: item.product.slug,
      sku: item.product.sku,
      variant_label: item.variantLabel,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
      image_url: item.product.image_url,
      weight_grams: item.weightGrams,
      metadata: item.product.metadata ?? {},
    }))

    const { error: itemsError } = await serviceClient
      .from('checkout_session_items')
      .insert(sessionItems)

    if (itemsError) throw itemsError

    return jsonResponse({
      checkoutSessionId: session.id,
      totals: {
        subtotal,
        shipping: shippingAmount,
        tax,
        discount,
        total,
      },
      selectedCourier: selectedCourierForResponse,
      couriers: couriersForResponse,
      codAvailable: session.cod_available,
      estimatedDeliveryDate: session.estimated_delivery_date,
    })
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Checkout session could not be created.' }, 500)
  }
})
