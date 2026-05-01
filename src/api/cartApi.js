import { requireSupabaseClient } from '../lib/supabaseClient.js'
import { SUPABASE_TABLES } from '../lib/supabase/tables.js'
import { normalizeProduct } from './productApi.js'

const CART_COLUMNS = `
  id,
  user_id,
  product_id,
  variant_label,
  quantity,
  products:product_id (
    id,
    slug,
    name,
    category_id,
    price,
    sale_price,
    rating,
    reviews_count,
    badge,
    badge_style,
    description,
    image_url,
    is_featured,
    is_active,
    stock_quantity,
    created_at,
    categories:category_id (
      id,
      name,
      slug
    )
  )
`

function toCartItem(row) {
  const product = normalizeProduct(row.products)

  return {
    id: row.id,
    productId: row.product_id,
    name: product.name,
    variant: row.variant_label,
    price: product.price,
    quantity: row.quantity,
    image: product.image,
    product,
  }
}

export async function fetchCartItems(userId) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.cartItems)
    .select(CART_COLUMNS)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map(toCartItem)
}

export async function addCartItem(userId, productId, quantity = 1, variantLabel = '250g') {
  const supabase = requireSupabaseClient()
  const { data: existingItem, error: findError } = await supabase
    .from(SUPABASE_TABLES.cartItems)
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('variant_label', variantLabel)
    .maybeSingle()

  if (findError) throw findError

  if (existingItem) {
    return updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity)
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.cartItems)
    .insert({
      user_id: userId,
      product_id: productId,
      variant_label: variantLabel,
      quantity,
    })
    .select(CART_COLUMNS)
    .single()

  if (error) throw error

  return toCartItem(data)
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.cartItems)
    .update({ quantity })
    .eq('id', cartItemId)
    .select(CART_COLUMNS)
    .single()

  if (error) throw error

  return toCartItem(data)
}

export async function removeCartItem(cartItemId) {
  const supabase = requireSupabaseClient()
  const { error } = await supabase
    .from(SUPABASE_TABLES.cartItems)
    .delete()
    .eq('id', cartItemId)

  if (error) throw error
}

