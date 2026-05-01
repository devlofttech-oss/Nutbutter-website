import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import { fetchCategories, fetchProducts } from '../api/productApi.js'

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

export default function ShopPage() {
  const [activeCategoryId, setActiveCategoryId] = useState('All')
  const [sort, setSort] = useState('featured')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const activeFilterLabel = useMemo(() => {
    if (activeCategoryId === 'All') return 'All'
    return categories.find((category) => category.id === activeCategoryId)?.name ?? 'All'
  }, [activeCategoryId, categories])

  useEffect(() => {
    let isMounted = true

    fetchCategories()
      .then((data) => {
        if (isMounted) setCategories(data)
      })
      .catch(() => {
        if (isMounted) setCategories([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const searchDelay = window.setTimeout(() => {
      setIsLoading(true)

      fetchProducts({
        categoryId: activeCategoryId === 'All' ? null : activeCategoryId,
        search: search.trim(),
        sort,
      })
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
    }, 250)

    return () => {
      isMounted = false
      window.clearTimeout(searchDelay)
    }
  }, [activeCategoryId, search, sort])

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Shop Hero */}
        <section className="mt-24 mb-16 text-center">
          <h1 className="font-serif text-[48px] md:text-[64px] leading-tight text-primary mb-4">Our Products</h1>
          <p className="text-lg leading-8 text-secondary max-w-2xl mx-auto">
            Explore our natural and healthy nut butter range, crafted with artisanal care and sustainably sourced ingredients.
          </p>
        </section>

        {/* Filter/Sort Bar */}
        <section className="flex flex-col md:flex-row justify-between items-center py-8 mb-12 border-y border-outline-variant/30 gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <button className="text-xs font-bold uppercase tracking-[0.18em] text-primary flex items-center gap-2" type="button">
              Filter by: {activeFilterLabel} <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="h-4 w-px bg-outline-variant/50 hidden md:block" />
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`text-xs font-bold uppercase tracking-[0.18em] transition-colors ${activeCategoryId === category.id ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  {category.name}
                </button>
              ))}
              <button className="text-xs font-bold uppercase tracking-[0.18em] text-secondary hover:text-primary transition-colors" type="button" onClick={() => setActiveCategoryId('All')}>
                Reset
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="relative">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-secondary text-base">search</span>
              <input
                className="bg-transparent border-0 border-b border-outline-variant pl-7 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary placeholder:text-secondary focus:ring-0 focus:border-primary"
                placeholder="Search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-secondary uppercase tracking-[0.18em]">Sort by:</span>
              <select className="bg-transparent border-none text-xs font-bold uppercase tracking-[0.18em] text-primary focus:ring-0 cursor-pointer" value={sort} onChange={(event) => setSort(event.target.value)}>
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        {isLoading && <ShopState message="Loading products..." />}
        {!isLoading && error && <ShopState message="Products could not be loaded right now." />}
        {!isLoading && !error && products.length === 0 && <ShopState message="No products match your selection." />}
        {!isLoading && !error && products.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 pb-32">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

function ShopState({ message }) {
  return (
    <section className="pb-32">
      <div className="rounded-[28px] border border-outline-variant bg-surface-container-low px-8 py-16 text-center text-on-surface-variant">
        {message}
      </div>
    </section>
  )
}
