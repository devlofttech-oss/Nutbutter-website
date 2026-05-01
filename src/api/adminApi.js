import { requireSupabaseClient } from '../lib/supabaseClient.js'
import { SUPABASE_TABLES } from '../lib/supabase/tables.js'

const PRODUCT_COLUMNS = 'id, name, slug, sku, price, stock_quantity, is_featured, is_active, image_url, category_id, description, badge, rating, reviews_count, created_at, categories:category_id(id, name, slug)'
const ORDER_COLUMNS = 'id, order_number, customer_email, customer_phone, status, payment_status, total_amount, created_at, order_items(id, product_name, quantity, line_total)'

export async function isCurrentUserAdmin(userId) {
  if (!userId) return false

  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.adminRoles)
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  return Boolean(data)
}

export async function fetchAdminStats() {
  const supabase = requireSupabaseClient()
  const [products, orders, messages, coupons] = await Promise.all([
    supabase.from(SUPABASE_TABLES.products).select('id', { count: 'exact', head: true }),
    supabase.from(SUPABASE_TABLES.orders).select('id,total_amount', { count: 'exact' }),
    supabase.from(SUPABASE_TABLES.contactMessages).select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from(SUPABASE_TABLES.coupons).select('id', { count: 'exact', head: true }).eq('is_active', true),
  ])

  ;[products, orders, messages, coupons].forEach((result) => {
    if (result.error) throw result.error
  })

  const revenue = (orders.data ?? []).reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0)

  return {
    productCount: products.count ?? 0,
    orderCount: orders.count ?? 0,
    openMessages: messages.count ?? 0,
    activeCoupons: coupons.count ?? 0,
    revenue,
  }
}

export async function fetchAdminProducts() {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.products)
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function saveAdminProduct(product) {
  const supabase = requireSupabaseClient()
  const payload = {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category_id: product.category_id || null,
    price: Number(product.price),
    stock_quantity: Number(product.stock_quantity ?? 0),
    description: product.description,
    image_url: product.image_url,
    badge: product.badge || null,
    is_featured: Boolean(product.is_featured),
    is_active: Boolean(product.is_active),
  }
  const query = product.id
    ? supabase.from(SUPABASE_TABLES.products).update(payload).eq('id', product.id)
    : supabase.from(SUPABASE_TABLES.products).insert(payload)
  const { data, error } = await query.select(PRODUCT_COLUMNS).single()

  if (error) throw error

  return data
}

export async function deleteAdminProduct(productId) {
  const supabase = requireSupabaseClient()
  const { error } = await supabase.from(SUPABASE_TABLES.products).delete().eq('id', productId)

  if (error) throw error
}

export async function uploadProductImage(file) {
  const supabase = requireSupabaseClient()
  const extension = file.name.split('.').pop()
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function fetchAdminOrders(search = '') {
  const supabase = requireSupabaseClient()
  let query = supabase.from(SUPABASE_TABLES.orders).select(ORDER_COLUMNS).order('created_at', { ascending: false })

  if (search.trim()) {
    query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) throw error

  return data ?? []
}

export async function updateAdminOrderStatus(orderId, status) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.orders)
    .update({ status })
    .eq('id', orderId)
    .select(ORDER_COLUMNS)
    .single()

  if (error) throw error

  return data
}

export async function fetchAdminCustomers() {
  const supabase = requireSupabaseClient()
  const { data: profiles, error: profileError } = await supabase
    .from(SUPABASE_TABLES.profiles)
    .select('id, full_name, phone, created_at')
    .order('created_at', { ascending: false })
  const { data: orders, error: orderError } = await supabase
    .from(SUPABASE_TABLES.orders)
    .select('user_id, total_amount')

  if (profileError) throw profileError
  if (orderError) throw orderError

  return (profiles ?? []).map((profile) => {
    const customerOrders = (orders ?? []).filter((order) => order.user_id === profile.id)
    return {
      ...profile,
      orderCount: customerOrders.length,
      spendTotal: customerOrders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0),
    }
  })
}

export async function fetchContactMessages() {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.contactMessages)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function resolveContactMessage(messageId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.contactMessages)
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', messageId)
    .select('*')
    .single()

  if (error) throw error

  return data
}

export async function createContactMessage(payload) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.from(SUPABASE_TABLES.contactMessages).insert(payload).select('*').single()

  if (error) throw error

  return data
}

export async function fetchCoupons() {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.from(SUPABASE_TABLES.coupons).select('*').order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function saveCoupon(coupon) {
  const supabase = requireSupabaseClient()
  const payload = {
    code: coupon.code.toUpperCase(),
    description: coupon.description || null,
    discount_type: coupon.discount_type,
    discount_value: Number(coupon.discount_value),
    expires_at: coupon.expires_at || null,
    usage_limit: coupon.usage_limit ? Number(coupon.usage_limit) : null,
    is_active: Boolean(coupon.is_active),
  }
  const query = coupon.id
    ? supabase.from(SUPABASE_TABLES.coupons).update(payload).eq('id', coupon.id)
    : supabase.from(SUPABASE_TABLES.coupons).insert(payload)
  const { data, error } = await query.select('*').single()

  if (error) throw error

  return data
}
