import { selectRows } from './databaseApi.js'
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
  shiprocket_courier_id,
  shiprocket_courier_name,
  estimated_delivery_date,
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
  ),
  shipments (
    id,
    provider,
    status,
    shiprocket_order_id,
    shiprocket_shipment_id,
    courier_company_id,
    courier_name,
    awb_code,
    tracking_url,
    estimated_delivery_date,
    freight_charge,
    last_tracked_at
  )
`

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
