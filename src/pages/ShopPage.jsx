import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import { PRODUCTS } from '../data/constants.js'

const CATEGORIES = ['All Spreads', 'Classic Butters', 'Exotic Blends']
const DIET_TAGS = ['Vegan', 'Keto', 'Organic']
const SORT_OPTIONS = ['Best Selling', 'New Arrivals', 'Price: Low to High', 'Price: High to Low']

const getNumericPrice = (price) => Number(String(price).replace(/[^\d]/g, ''))

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Spreads')
  const [texture, setTexture] = useState('')
  const [sort, setSort] = useState('Best Selling')
  const [activeDiet, setActiveDiet] = useState([])

  const toggleDiet = (tag) =>
    setActiveDiet((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const filteredProducts = PRODUCTS
    .filter((product) => {
      const categoryMatches = selectedCategory === 'All Spreads'
        || product.category === selectedCategory
        || (selectedCategory === 'Classic Butters' && product.category === 'Classic Butter')
      const textureMatches = !texture
        || (texture === 'Smooth' && !product.description.toLowerCase().includes('crunchy'))
        || (texture === 'Crunchy' && product.description.toLowerCase().includes('crunchy'))
      const dietMatches = activeDiet.length === 0
        || activeDiet.some((tag) => `${product.badge ?? ''} ${product.description}`.toLowerCase().includes(tag.toLowerCase()))

      return categoryMatches && textureMatches && dietMatches
    })
    .sort((a, b) => {
      if (sort === 'Price: Low to High') return getNumericPrice(a.price) - getNumericPrice(b.price)
      if (sort === 'Price: High to Low') return getNumericPrice(b.price) - getNumericPrice(a.price)
      if (sort === 'New Arrivals') return b.id - a.id
      return Number(b.rating) - Number(a.rating)
    })

  return (
    <div className="bg-background text-on-surface">
      <Header />

      <main>
        {/* 1. Hero */}
        <section className="bg-surface-container-low py-xl">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="max-w-xl">
              <nav className="flex items-center gap-2 mb-sm text-xs text-secondary">
                <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
                <span className="text-primary font-semibold font-serif">Shop All</span>
              </nav>
              <h1 className="font-serif text-headline-xl text-primary mb-md">Shop Nut Butters</h1>
              <p className="font-serif text-body-lg text-on-surface-variant">
                Stone-ground nutrition crafted with clean ingredients. Small-batch produced to ensure premium texture and flavor in every jar.
              </p>
            </div>
            <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1/1' }}>
              <img
                src={PRODUCTS[0].image}
                alt="Artisan Nut Butter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. Filters + Grid */}
        <section className="max-w-7xl mx-auto px-8 py-xl">
          <div className="flex flex-col md:flex-row gap-lg">

            {/* Sidebar */}
            <aside style={{ width: 256, flexShrink: 0 }}>
              <div className="sticky top-28 space-y-md">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-primary mb-base">Filters</h3>
                  <div className="h-px bg-outline-variant w-full mb-md" />
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-sm uppercase tracking-wider">Category</h4>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#33210d' }}
                        />
                        <span className="font-serif text-base group-hover:text-primary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Texture */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-sm uppercase tracking-wider">Texture</h4>
                  <div className="space-y-2">
                    {['Smooth', 'Crunchy'].map((t) => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="texture"
                          checked={texture === t}
                          onChange={() => setTexture(t)}
                          className="w-5 h-5"
                          style={{ accentColor: '#33210d' }}
                        />
                        <span className="font-serif text-base group-hover:text-primary transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-sm uppercase tracking-wider">Price Range</h4>
                  <input type="range" min="299" max="1499" className="w-full cursor-pointer" style={{ accentColor: '#33210d' }} />
                  <div className="flex justify-between text-xs text-secondary mt-2">
                    <span>₹299</span><span>₹1,499</span>
                  </div>
                </div>

                {/* Diet */}
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-sm uppercase tracking-wider">Diet</h4>
                  <div className="flex flex-wrap gap-2">
                    {DIET_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleDiet(tag)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border border-outline-variant cursor-pointer transition-colors ${
                          activeDiet.includes(tag)
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Sort bar */}
              <div className="flex justify-between items-center mb-lg">
                <p className="font-serif text-base text-on-surface-variant">
                  Showing {filteredProducts.length} of {PRODUCTS.length} products
                </p>
                <div className="relative inline-block">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-surface-container border border-outline-variant py-2 pl-4 pr-10 rounded-lg text-sm font-semibold text-primary cursor-pointer font-serif"
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              <div className="mt-xl flex justify-center items-center gap-base">
                <button className="p-base rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                      n === 1 ? 'bg-primary-container text-on-primary' : 'border border-outline-variant hover:bg-surface-container'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button className="p-base rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Bundles */}
        <section id="bundles" className="py-xl bg-primary-container text-on-primary">
          <div className="max-w-7xl mx-auto px-margin">
            <h2 className="font-serif text-headline-lg mb-lg text-center">Combo Packs &amp; Bundles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              <div className="p-lg rounded-xl border space-y-md" style={{ background: 'rgba(231,226,217,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xs text-secondary-fixed uppercase tracking-tighter font-semibold">Value Pack</span>
                <h3 className="font-serif text-headline-lg">The Taster Bundle</h3>
                <p className="text-body-lg opacity-80">Three of our most popular flavors (200g each) for a perfect introduction.</p>
                <div className="flex items-center gap-md">
                  <span className="font-serif text-headline-lg">₹1,199</span>
                  <span className="line-through opacity-40">₹1,499</span>
                  <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-2 py-1 rounded">Save 20%</span>
                </div>
                <Link to="/cart">
                  <button className="w-full py-sm rounded-lg text-sm font-semibold border border-white/20 transition-all bg-primary text-on-primary hover:opacity-90">
                    Add Bundle to Cart
                  </button>
                </Link>
              </div>
              <div className="p-lg rounded-xl border space-y-md" style={{ background: 'rgba(231,226,217,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xs text-secondary-fixed uppercase tracking-tighter font-semibold">Membership</span>
                <h3 className="font-serif text-headline-lg">Butter Club Subscription</h3>
                <p className="text-body-lg opacity-80">Save 15% on every jar and get exclusive access to seasonal flavors.</p>
                <ul className="space-y-xs text-body-md opacity-80">
                  {['Free shipping on all orders', 'Cancel or skip anytime', 'Early access to new drops'].map((b) => (
                    <li key={b} className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-sm">check</span> {b}
                    </li>
                  ))}
                </ul>
                <Link to="/checkout">
                  <button className="bg-secondary text-on-secondary w-full py-sm rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                    Join the Club
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Trust Strip */}
        <section className="py-lg border-y border-outline-variant">
          <div className="max-w-7xl mx-auto px-margin grid grid-cols-2 md:grid-cols-4 gap-md text-center">
            {[
              { icon: 'eco', label: 'Preservative Free' },
              { icon: 'spa', label: 'Vegan Friendly' },
              { icon: 'verified', label: 'No Additives' },
              { icon: 'local_shipping', label: 'Fast Delivery' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-base">
                <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
