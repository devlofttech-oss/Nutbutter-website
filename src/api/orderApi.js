import { insertRows, selectRows } from './databaseApi.js'
import { SUPABASE_TABLES } from '../lib/supabase/tables.js'

const ORDER_COLUMNS = `
  id,
  order_number,
  user_id,
  customer_email,
  customer_phone,
  status,
  payment_status,
  subtotal,
  shipping_amount,
  tax_amount,
  discount_amount,
  total_amount,
  currency,
  delivery_method,
  created_at,
  order_items (
    id,
    product_name,
    product_slug,
    variant_label,
    quantity,
    unit_price,
    line_total,
    image_url
  ),
  payments (
    id,
    provider,
    merchant_order_id,
    status,
    amount
  )
`

function createOrderNumber() {
  const date = new Date()
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ANC-${stamp}-${random}`
}

export async function saveAddress(userId, address) {
  const [data] = await insertRows(SUPABASE_TABLES.addresses, {
    user_id: userId,
    full_name: address.fullName,
    email: address.email,
    phone: address.phone,
    address_line1: address.address,
    address_line2: address.addressLine2 || null,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country || 'India',
  })

  return data
}

export async function createOrder({ userId, formValues, billingSameAsShipping, billingValues, cartItems, totals, deliveryMethod }) {
  const shippingAddress = await saveAddress(userId, formValues)
  const billingAddress = billingSameAsShipping
    ? shippingAddress
    : await saveAddress(userId, billingValues)

  const [order] = await insertRows(SUPABASE_TABLES.orders, {
    order_number: createOrderNumber(),
    user_id: userId,
    shipping_address_id: shippingAddress.id,
    billing_address_id: billingAddress.id,
    customer_email: formValues.email,
    customer_phone: formValues.phone,
    status: 'pending_payment',
    payment_status: 'pending',
    subtotal: totals.subtotal,
    shipping_amount: totals.shipping,
    tax_amount: totals.tax,
    discount_amount: totals.discount,
    total_amount: totals.total,
    delivery_method: deliveryMethod,
    billing_same_as_shipping: billingSameAsShipping,
  })

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    product_slug: item.product?.slug ?? null,
    variant_label: item.variant,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
    image_url: item.image,
  }))

  await insertRows(SUPABASE_TABLES.orderItems, orderItems, { returning: false })

  return order
}

export async function fetchMyOrders() {
  const { data } = await selectRows(SUPABASE_TABLES.orders, {
    columns: ORDER_COLUMNS,
    order: { column: 'created_at', ascending: false },
  })

  return data ?? []
}

export async function fetchOrderById(orderId) {
  const { data } = await selectRows(SUPABASE_TABLES.orders, {
    columns: ORDER_COLUMNS,
    filters: [{ column: 'id', value: orderId }],
    maybeSingle: true,
  })

  return data
}

