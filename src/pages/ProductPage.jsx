import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import EcommerceFaqSection from '../components/EcommerceFaqSection.jsx'
import { fetchProductBySlugOrId, fetchProductReviews, fetchProducts, fetchRelatedProducts } from '../api/productApi.js'
import { useCart } from '../providers/CartProvider.jsx'

const benefits = [
  ['eco', 'No Sugar'],
  ['security', 'No Preservatives'],
  ['forest', 'No Palm Oil'],
  ['fitness_center', 'High Protein'],
]

const useIdeas = [
  ['The Morning Toast', 'Elevate your breakfast on stone-milled sourdough.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAdmQXEyO5EVCpsvYQI3AIGPe2NAYKzGGS8qpCNVMNO-B75637yEXU8piT8xhJOLDOju4Nt3BLX4eQcHJEr7DzEGialIU_VFHQjEEyF08N6Cz9Mo-yWpkPIyNilF0MMpnHA9iX-FTaFDtzqI6twD_Rgx_Uo1qhW4urKI7p-krFMH_flOuecYg4df8eAOj-xP0yW3RWdeFVNA4siPSRbnrbEvqR5ooDXXc8OZDRgcGH9UYG8-Tmb-aymXtJU60ASAE34NzbFxl9nDs'],
  ['Vitality Smoothies', 'Add a spoonful of healthy fats to your daily blend.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfwNgtHDMo9NBcaew5nQpiCxfaoctvA5NRwsOzuIITafNGoHPNM3iaGpDGqYR1r_446Ein3ifdELZmEkskFUfFxwe5yrjKDTixuSILc4zHRzVpE8SAJcwm2VdN6CRxs6MHHDUNlUBrbiX1nkNkQjtSdqJfWPACs0lNa6tz31ewx8aEKbLLXq81jMUNQEnNR1lyER7SqBis3Py8a_SpjeedEW95_LFxXZh0KGOnWwRs9ZUpV9yok1VTQ8lx3xMyFf1lGLV4ORkuhO0'],
  ['The Mid-Day Snack', 'Perfect paired with crisp seasonal fruit slices.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK8Rl8T9uwOPMwVZM9jG0BFTScqrPdKksPdWJbCKpc_dnZjN0-Lw9-LMgrqvbRfvf8PXMR1-9zg1JdFWUeONyFAwkKPnYK-VGpCyho1mrt-x-nsy41pxvfYxdtD05AHP5qC1agDZUDIe0vA6qJ2MFDmtjbLEzFxVcq1LsklU3b3zXS3uumx_eGyOXXqqAMo6E3nSYITda7aW0og94Olc0rcUE6pld21ChfkXSnkAIYhCCniFv88hvQUOz-aAWjtS1gYFiuiLU4ZjQ'],
]

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState('250g')
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')

    const productRequest = slug
      ? fetchProductBySlugOrId(slug)
      : fetchProducts({ sort: 'featured', range: { from: 0, to: 0 } }).then(({ data }) => data[0] ?? null)

    productRequest
      .then(async (productData) => {
        if (!isMounted) return

        if (!productData) {
          setProduct(null)
          setRelatedProducts([])
          setReviews([])
          return
        }

        setProduct(productData)
        const [relatedResult, reviewData] = await Promise.all([
          fetchRelatedProducts(productData, 3),
          fetchProductReviews(productData.id),
        ])

        if (!isMounted) return
        setRelatedProducts(relatedResult.data)
        setReviews(reviewData)
      })
      .catch((fetchError) => {
        if (!isMounted) return
        setError(fetchError.message)
        setProduct(null)
        setRelatedProducts([])
        setReviews([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (isLoading) {
    return <ProductPageState message="Loading product..." />
  }

  if (error) {
    return <ProductPageState message="This product could not be loaded right now." />
  }

  if (!product) {
    return <ProductPageState message="Product not found." />
  }

  const nutrition = product.nutrition ?? {}
  const ingredients = product.ingredients?.length ? product.ingredients.join(', ') : 'Slow-Roasted Heirloom Nuts, Himalayan Sea Salt.'

  const handleAddToCart = async () => {
    setIsAddingToCart(true)

    try {
      await addToCart(product, quantity, size)
      navigate('/cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="bg-background text-on-background">
      <Header />
      <main className="pt-8 md:pt-16 pb-16 md:pb-32 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 md:mb-12 text-on-surface-variant text-[11px] md:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.18em] overflow-x-auto whitespace-nowrap pb-1">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{product.name}</span>
        </nav>

        {/* Product Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start mb-16 md:mb-[120px]">
          <div className="relative group">
            <div className="aspect-[4/5] bg-surface-container-low rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(111,88,60,0.08)]">
              <img alt={`${product.name} Product Image`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={product.image} />
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="border-b border-outline-variant pb-6 md:pb-8">
              <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] mb-4 block">100% Natural Nut Butter</span>
              <h1 className="font-serif text-[36px] sm:text-[42px] md:text-[64px] leading-tight text-on-background mb-4">{product.name}</h1>
              <p className="text-xl md:text-2xl text-primary">{product.priceLabel}</p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-on-surface text-xs font-bold uppercase tracking-[0.18em] block mb-4">Select Size</span>
                <div className="flex gap-3 md:gap-4">
                  {['250g', '500g'].map((option) => (
                    <button key={option} className={`min-h-11 px-6 md:px-8 py-3 rounded-full border-2 transition-all ${size === option ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface hover:border-primary'}`} type="button" onClick={() => setSize(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-on-surface text-xs font-bold uppercase tracking-[0.18em] block mb-4">Quantity</span>
                <div className="flex items-center border border-outline-variant w-fit rounded-lg bg-surface">
                  <button className="p-3 hover:text-primary transition-colors" type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}><span className="material-symbols-outlined">remove</span></button>
                  <span className="px-6 font-medium text-on-background">{quantity}</span>
                  <button className="p-3 hover:text-primary transition-colors" type="button" onClick={() => setQuantity((current) => current + 1)}><span className="material-symbols-outlined">add</span></button>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-4 md:py-5 rounded-full font-serif text-xl md:text-2xl shadow-[0_20px_60px_rgba(111,88,60,0.12)] hover:bg-primary-container active:scale-[0.98] transition-all" type="button" onClick={handleAddToCart} disabled={isAddingToCart}>
              {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
            <div className="mt-4 flex flex-wrap gap-4">
              {['NO ADDED SUGAR', 'NO PALM OIL'].map((label) => (
                <span key={label} className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase tracking-[0.12em]">
                  <span className="material-symbols-outlined text-[18px]">verified</span> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Key Benefits Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-10 md:py-16 border-y border-outline-variant mb-16 md:mb-[120px]">
          {benefits.map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center text-center gap-3">
              <span className="material-symbols-outlined text-4xl text-primary">{icon}</span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-background">{label}</span>
            </div>
          ))}
        </div>

        {/* Description & Ingredients & Nutrition */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 mb-16 md:mb-[120px]">
          <div className="lg:col-span-2 flex flex-col gap-8 md:gap-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-5 md:mb-6">Artisanal Craftsmanship</h2>
              <p className="text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant max-w-2xl">
                {product.description}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-on-background mb-4">Ingredients</h3>
              <p className="text-xl md:text-2xl text-primary">{ingredients}</p>
            </div>
          </div>
          <div className="bg-surface-container rounded-[22px] md:rounded-[28px] p-5 md:p-8 shadow-[0_20px_60px_rgba(111,88,60,0.08)] self-start">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-on-background mb-8">Nutrition Information</h3>
            <div className="flex flex-col gap-4">
              {[
                ['Protein', nutrition.protein ?? '6g'],
                ['Healthy Fats', nutrition.healthy_fats ?? '14g'],
                ['Fiber', nutrition.fiber ?? '4g'],
                ['Calories', nutrition.calories ?? '190'],
              ].map(([label, value]) => {
                return (
                  <div key={label} className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant">{label}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-6 text-xs text-on-surface-variant italic">Values per 32g serving.</p>
          </div>
        </div>

        {/* How To Use */}
        <div className="mb-16 md:mb-[120px]">
          <h2 className="font-serif text-[34px] md:text-[64px] leading-tight text-center mb-10 md:mb-16">The Ritual of Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useIdeas.map(([title, body, image]) => (
              <div key={title} className="group cursor-pointer">
                <div className="aspect-square bg-surface-container rounded-[28px] overflow-hidden mb-6 shadow-[0_20px_60px_rgba(111,88,60,0.08)]">
                  <img alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={image} />
                </div>
                <h4 className="font-serif text-2xl text-center">{title}</h4>
                <p className="text-on-surface-variant text-center mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16 md:mb-[120px]">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10 md:mb-16">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-2">Customer Reflections</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-primary">{Array.from({ length: 5 }).map((_, index) => <span key={index} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}</div>
                <span className="text-xl md:text-2xl">{product.rating}</span>
                <span className="text-on-surface-variant">({product.reviews} reviews)</span>
              </div>
            </div>
            <button className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-on-primary transition-all" type="button">Write a Review</button>
          </div>
          {reviews.length === 0 ? (
            <div className="bg-white p-6 md:p-10 rounded-[22px] md:rounded-[28px] shadow-[0_20px_60px_rgba(111,88,60,0.08)] border border-surface-container-high text-on-surface-variant">
              No reviews have been published for this product yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 md:p-10 rounded-[22px] md:rounded-[28px] shadow-[0_20px_60px_rgba(111,88,60,0.08)] border border-surface-container-high">
                  <div className="flex justify-between items-center mb-4 gap-4">
                    <span className="font-bold text-on-background">{review.customer_name}</span>
                    <span className="text-on-surface-variant text-sm">{review.is_verified_purchase ? 'Verified Buyer' : 'Customer'}</span>
                  </div>
                  <p className="text-on-surface-variant italic">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16 md:mb-[120px]">
            <h2 className="font-serif text-3xl md:text-4xl mb-8 md:mb-12">Complete Your Pantry</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        )}
        <EcommerceFaqSection title="Product Questions" />
      </main>
      <Footer />
    </div>
  )
}

function ProductPageState({ message }) {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main className="pt-8 md:pt-16 pb-16 md:pb-32 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="rounded-[22px] md:rounded-[28px] border border-outline-variant bg-surface-container-low px-5 md:px-8 py-12 md:py-16 text-center text-on-surface-variant">
          {message}
        </div>
      </main>
      <Footer />
    </div>
  )
}
