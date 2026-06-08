import { selectRows } from './databaseApi.js'
import { SUPABASE_TABLES } from '../lib/supabase/tables.js'

const PRODUCT_COLUMNS = `
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
  ingredients,
  nutrition,
  image_url,
  gallery_urls,
  is_featured,
  is_active,
  stock_quantity,
  created_at,
  categories:category_id (
    id,
    name,
    slug
  )
`

const CATEGORY_COLUMNS = `
  id,
  name,
  slug,
  description,
  image_url,
  sort_order,
  is_active
`

const REVIEW_COLUMNS = `
  id,
  product_id,
  customer_name,
  title,
  body,
  rating,
  is_verified_purchase,
  created_at
`

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function normalizeProduct(product) {
  if (!product) return null

  const price = Number(product.sale_price ?? product.price ?? 0)
  const categoryRecord = Array.isArray(product.categories) ? product.categories[0] : product.categories
  const galleryImages = normalizeGalleryImages(product.image_url, product.gallery_urls)

  return {
    ...product,
    category: categoryRecord?.name ?? 'Nut Butter',
    categoryRecord,
    categoryName: categoryRecord?.name ?? 'Nut Butter',
    categorySlug: categoryRecord?.slug ?? '',
    image: galleryImages[0] ?? product.image_url,
    galleryImages,
    price,
    priceLabel: formatCurrency(price),
    originalPrice: product.sale_price ? Number(product.price) : null,
    rating: Number(product.rating ?? 0).toFixed(1),
    reviews: product.reviews_count ?? 0,
    badgeStyle: product.badge_style,
  }
}

function normalizeGalleryImages(primaryImage, galleryUrls = []) {
  const secondaryImages = Array.isArray(galleryUrls) ? galleryUrls : []

  return [primaryImage, ...secondaryImages]
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter(Boolean)
    .filter((url, index, urls) => urls.indexOf(url) === index)
}

function normalizeProducts(products = []) {
  return products.map(normalizeProduct).filter(Boolean)
}

function getProductOrders(sort = 'featured') {
  if (sort === 'price-asc') return [{ column: 'price', ascending: true }]
  if (sort === 'price-desc') return [{ column: 'price', ascending: false }]
  if (sort === 'newest') return [{ column: 'created_at', ascending: false }]

  return [
    { column: 'is_featured', ascending: false },
    { column: 'rating', ascending: false },
    { column: 'created_at', ascending: false },
  ]
}

export async function fetchCategories() {
  const { data } = await selectRows(SUPABASE_TABLES.categories, {
    columns: CATEGORY_COLUMNS,
    filters: [{ column: 'is_active', value: true }],
    order: { column: 'sort_order', ascending: true },
  })

  return data ?? []
}

export async function fetchProducts(options = {}) {
  const filters = [{ column: 'is_active', value: true }]

  if (options.categoryId) {
    filters.push({ column: 'category_id', value: options.categoryId })
  }

  if (options.search) {
    filters.push({ column: 'name', operator: 'ilike', value: `%${options.search}%` })
  }

  if (options.featuredOnly) {
    filters.push({ column: 'is_featured', value: true })
  }

  if (options.excludeId) {
    filters.push({ column: 'id', operator: 'neq', value: options.excludeId })
  }

  const { data, count } = await selectRows(SUPABASE_TABLES.products, {
    columns: options.columns ?? PRODUCT_COLUMNS,
    filters: [...filters, ...(options.filters ?? [])],
    orders: options.orders ?? getProductOrders(options.sort),
    range: options.range,
  })

  return { data: normalizeProducts(data), count }
}

export async function fetchFeaturedProducts(limit = 4) {
  return fetchProducts({
    featuredOnly: true,
    range: { from: 0, to: limit - 1 },
  })
}

export async function fetchProductBySlugOrId(slugOrId) {
  const numericId = Number(slugOrId)
  const filters = Number.isFinite(numericId)
    ? [{ column: 'id', value: numericId }]
    : [{ column: 'slug', value: slugOrId }]

  const { data } = await selectRows(SUPABASE_TABLES.products, {
    columns: PRODUCT_COLUMNS,
    filters,
    maybeSingle: true,
  })

  return normalizeProduct(data)
}

export async function fetchRelatedProducts(product, limit = 3) {
  if (!product?.id) return { data: [] }

  return fetchProducts({
    categoryId: product.category_id,
    excludeId: product.id,
    sort: 'featured',
    range: { from: 0, to: limit - 1 },
  })
}

export async function fetchProductReviews(productId) {
  if (!productId) return []

  const { data } = await selectRows(SUPABASE_TABLES.reviews, {
    columns: REVIEW_COLUMNS,
    filters: [
      { column: 'product_id', value: productId },
      { column: 'is_published', value: true },
    ],
    order: { column: 'created_at', ascending: false },
  })

  return data ?? []
}
