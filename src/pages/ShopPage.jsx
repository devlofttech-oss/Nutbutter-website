import { useMemo, useState } from 'react'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import { PRODUCTS } from '../data/constants.js'

const filters = ['All', 'Almond', 'Peanut', 'Cashew']
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

const getNumericPrice = (price) => Number(String(price).replace(/[^\d]/g, ''))

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [sort, setSort] = useState('Featured')

  const products = useMemo(() => {
    return PRODUCTS
      .filter((product) => activeFilter === 'All' || product.name.toLowerCase().includes(activeFilter.toLowerCase()))
      .sort((a, b) => {
        if (sort === 'Price: Low to High') return getNumericPrice(a.price) - getNumericPrice(b.price)
        if (sort === 'Price: High to Low') return getNumericPrice(b.price) - getNumericPrice(a.price)
        if (sort === 'Newest') return b.id - a.id
        return Number(b.rating) - Number(a.rating)
      })
  }, [activeFilter, sort])

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
              Filter by: {activeFilter} <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <div className="h-4 w-px bg-outline-variant/50 hidden md:block" />
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
              {filters.slice(1).map((filter) => (
                <button
                  key={filter}
                  className={`text-xs font-bold uppercase tracking-[0.18em] transition-colors ${activeFilter === filter ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
              <button className="text-xs font-bold uppercase tracking-[0.18em] text-secondary hover:text-primary transition-colors" type="button" onClick={() => setActiveFilter('All')}>
                Reset
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-[0.18em]">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-bold uppercase tracking-[0.18em] text-primary focus:ring-0 cursor-pointer" value={sort} onChange={(event) => setSort(event.target.value)}>
              {sortOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 pb-32">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
