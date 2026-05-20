import { useEffect, useState } from 'react'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import EcommerceFaqSection from '../components/EcommerceFaqSection.jsx'
import { ProductGridSkeleton } from '../components/SkeletonLoader.jsx'
import { fetchProducts } from '../api/productApi.js'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    fetchProducts()
      .then(({ data }) => {
        if (!isMounted) return
        setProducts(data)
        setError('')
      })
      .catch((fetchError) => {
        if (!isMounted) return
        setProducts([])
        setError(fetchError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Shop Hero */}
        <section className="mt-14 md:mt-24 mb-10 md:mb-16 text-center">
          <h1 className="font-serif text-[38px] sm:text-[44px] md:text-[64px] leading-tight text-primary mb-4">Our Products</h1>
          <p className="text-base md:text-lg leading-7 md:leading-8 text-secondary max-w-2xl mx-auto">
            Explore our natural and healthy nut butter range, crafted with artisanal care and sustainably sourced ingredients.
          </p>
        </section>

        {/* Product Grid */}
        {isLoading && <section className="pb-16 md:pb-32"><ProductGridSkeleton /></section>}
        {!isLoading && error && <ShopState message="Products could not be loaded right now." />}
        {!isLoading && !error && products.length === 0 && <ShopState message="No products match your selection." />}
        {!isLoading && !error && products.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 md:gap-y-16 gap-x-12 pb-16 md:pb-32">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
        <EcommerceFaqSection title="Product Questions" />
      </main>
      <Footer />
    </div>
  )
}

function ShopState({ message }) {
  return (
    <section className="pb-16 md:pb-32">
      <div className="rounded-[22px] md:rounded-[28px] border border-outline-variant bg-surface-container-low px-5 md:px-8 py-12 md:py-16 text-center text-on-surface-variant">
        {message}
      </div>
    </section>
  )
}
