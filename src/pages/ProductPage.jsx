import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import { PRODUCTS } from '../data/constants.js'

const productImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOeua5gHO30HdYZOojkdBTmTcWm7rXdUTWgWULdlqGDuLt-8X3ptsqBJeNMuqhaATT8m8NQEb_ZgXHpidmUI87Ci0MZhL4yYdZNOthRJQ-Q7tlyhS7jvY_4zL0Snz7yWu4wdbPuYSBgMrSpnE7RSPTywPWLn_uBiA6BGGoK8NymzBQajfxTQj0ZB-UuZfWT8v1LVR98F3Ai7CPyursqhdOlvtGNc7dYrFhd_SUHc7nSlbx993rU346N4y2TSe_agD6C2nA4nZGZxI',
    alt: 'Premium glass jar of almond butter on a minimalist stone surface',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArq5_zp3jgkucmtv1uUPQ_X5wom8ld5emPzF1GGGLcPNd-cwIZOUqKvIJKYqY4nNCZYiof01pQjPLe5SU5aoe3SVIwsZrEeDy798LhGPkhgiLyBSrTVo_CVlMt5GuvhpJsp1cWrNjoVsuXexapxrJQW57nnhYni6Ay3tLCWmwrZe3JspoHSrR0F8DD6-6gITE9T6fVhO-ce1sMTn-wpKau_gVrGGoKBufo8dRYbBfN0YS5ECWkV-8udX8rV3xURiiH9LtriCtn7oc',
    alt: 'Close up thumbnail of almond butter texture',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_JTXnXK9Ii4wEYKfFcIeyKW04JrR2Py6biKm2tcVUxatqQJwqbWwCyyrcZSn1Z---xpMKf-KWH6RwGbXHrSc4aO27FN99xZ2M8v2WIPC1HHG_LaQ9XUi73beY3HZG6uLSsAHgZ-wjMh6iv3r91nsJSYNYcQ0e9zoU0E3B_-T-YJYd_yBADmqe4DVBqxsXFl0_l_CVoH6r0ggnMHwER9JYJGKRFLIR5vJp6UGkfRzgi1FdHED6rtda1GK_DMzq73MglMR8DhJUrxU',
    alt: 'Lifestyle shot of almond butter on rustic bread',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfkT-1TSLKjyhMuWw_k0Ob_5al_cvUfZukC5nNU1le5AXlQcDE60m_umrEy875kwYaO73Ptg4Twqh7of986hTjPCfcqjKSIQLXl3tElpUrdY8g8sRLHrozOnAPbsr1VkuvYNV-7cjvRRmKXkUvc_srs8EH3NJIEzxJP9tArJNvPY5FT-IV4rM0dRSvAncFIxpXIlma85iRu5tC5LumXtng2amZnku_GFHlbgrJ4vEUdTt3u0SLu20thIrBgV7Q8zWCsAMLrZPTeKQ',
    alt: 'Almond butter being drizzled over oatmeal',
  },
]

const sizes = ['200g', '500g', '1kg']
const highlights = [
  { icon: 'fitness_center', label: 'High Protein' },
  { icon: 'nest_eco_leaf', label: 'No Added Sugar' },
  { icon: 'grain', label: 'Stone Ground' },
]
const nutritionFacts = [
  ['Serving Size', '2 tbsp (32g)', true],
  ['Calories', '190', true],
  ['Total Fat', '16g'],
  ['Protein', '7g'],
  ['Total Carbohydrate', '6g'],
  ['Fiber', '4g'],
]
const benefits = [
  {
    icon: 'bolt',
    title: 'Fitness Fuel',
    body: 'Packed with plant-based protein and healthy fats to sustain your endurance and muscle recovery after every workout.',
  },
  {
    icon: 'favorite',
    title: 'Heart Health',
    body: 'Rich in Vitamin E and monounsaturated fats, our stone-ground butter supports long-term cardiovascular vitality.',
  },
]
const rituals = [
  {
    title: 'Toast Spread',
    body: 'The morning essential. Generously layered over warm, artisan sourdough bread.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhaNf9G_y7KeXoBnnUEuuUz1HROzpyrBqaPTK8uY0g5cJl9adw2wn4j_aZRD10jefU9eSutySetqFUBIONkkv85AtVyqEqP2Fa3lEapWNhi1DWoAnMMXSSyyo7PlwZrMKDe1mzOyAZW98l2HQM6RhBwnnGBep7_zAKZ4eC_PJ0Ptge1mn5wc28EbqFO0MqjhHSfiB4CSJxad7MslpvaWmzMArMTg_StNMAm5PcIFp3VZb7danop09VHUSD3PpwTuLoQTV0dv6V0-U',
  },
  {
    title: 'Smoothie Mix',
    body: 'A spoonful of richness. Blend into your favorite greens for a creamy, nutty boost.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcT73_7GNvCk7PdFEzFp7IJIAie8JrBbi9Sf_PUBjFxuTSGaRxxOUknz9gZMx9ZuOiSNDc7ENPmRkZbscqXpBKYIyx-q7-6plPvVg6AOBmHk5oxMbcXLUmzpyOpiWSoGiX_HgVfHEZpzT9WvV771CE9lqsPRjsbltdxUWa18C4QFUU-CrzzX2mIhrwcyyWiJD6PvGlNWj3G7ct2wWgqDfo6Tm41vRHaJiy1Urru_34z1l6UUcWJ5mq8e8UKGYEmx5XDaSFooP2s30',
  },
  {
    title: 'Oats Topping',
    body: 'Warm comfort. Swirl into steaming overnight oats for a melt-in-your-mouth experience.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPgXKvsvoj2NhYseRh4Z7HS6C36W4LUT8YC8VmQV7qfw4tu1cbecBsmoT9CS-ZLyHyO8zbslWU1IsCwhJVxqlMv1GtTlgixKR6q8iOB4FCFc1fgRBAVTexVgFY-lBZgZGOCOJ9ivAu42qFrGIWy_YZXbRPymZQ96UkZRh8x869JvtSAdoFIYjev41yudhbt1h38O3x5yAQmXrDAHxRRvBuzJWzi3CAmY9chcNPPpmxPLHCctAUsXXXQUOhAYZKawOeBX1KoQB04cY',
  },
]
const reviews = [
  {
    name: 'Elena V.',
    text: '"The texture is unlike anything I have ever bought in a store. You can actually taste the quality of the almonds. It is a staple in my pantry now."',
  },
  {
    name: 'Marcus T.',
    text: '"Simply pure. No hidden sugars, no junk. Just exactly what I need for my post-marathon snacks."',
  },
]

export default function ProductPage() {
  const navigate = useNavigate()
  const relatedProducts = PRODUCTS.filter((product) => product.id !== 1).slice(0, 4)

  return (
    <div className="bg-background text-on-surface">
      <Header />

      <main className="max-w-7xl mx-auto px-8 md:px-12 py-xl">
        <Breadcrumbs />
        <ProductHero onAddToCart={() => navigate('/cart')} />
        <TasteAndNutrition />
        <WellnessSection />
        <RitualsSection />
        <ReviewsSection />

        <section className="py-xl">
          <h2 className="font-serif text-headline-lg text-primary mb-lg">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  )
}

function Breadcrumbs() {
  return (
    <nav className="flex items-center gap-xs text-label-sm text-[#4B3621]/60 mb-md uppercase tracking-widest">
      <Link className="hover:text-primary transition-colors" to="/">Home</Link>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <span className="text-primary">Classic Almond Butter</span>
    </nav>
  )
}

function ProductHero({ onAddToCart }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
      <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-md">
        <div className="flex-1 overflow-hidden rounded-lg bg-surface-container-low">
          <img
            className="w-full h-[420px] md:h-[600px] object-cover"
            src={productImages[0].src}
            alt={productImages[0].alt}
          />
        </div>
        <div className="flex flex-row md:flex-col gap-sm w-full md:w-24 overflow-x-auto md:overflow-visible">
          {productImages.slice(1).map((image, index) => (
            <button
              key={image.src}
              className={`w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 transition-opacity ${
                index === 0 ? 'border-2 border-primary' : 'border border-outline-variant opacity-70 hover:opacity-100'
              }`}
              type="button"
              aria-label={`View ${image.alt}`}
            >
              <img className="w-full h-full object-cover" src={image.src} alt={image.alt} />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-md">
        <div className="space-y-xs">
          <h1 className="font-serif text-headline-xl text-primary">Classic Almond Butter</h1>
          <div className="flex items-center gap-sm">
            <StarRating />
            <button className="text-body-md text-[#4B3621]/70 underline" type="button">124 reviews</button>
          </div>
        </div>

        <p className="font-serif text-headline-md text-primary">₹549</p>
        <p className="font-serif text-body-lg text-[#4B3621]/80">
          Stone-ground, pure nutrition. A silky-smooth texture with the deep, earthy flavor of California almonds.
        </p>

        <div className="space-y-sm">
          <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">Select Size</p>
          <div className="flex gap-sm flex-wrap">
            {sizes.map((size, index) => (
              <button
                key={size}
                className={`px-md py-sm rounded-lg transition-colors ${
                  index === 0
                    ? 'border-2 border-primary text-primary font-semibold hover:bg-surface-container'
                    : 'border border-outline-variant text-[#4B3621]/70 hover:border-primary'
                }`}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-sm pt-md">
          <div className="flex items-center border border-outline-variant rounded-lg">
            <button className="px-md py-sm hover:bg-surface-container" type="button">-</button>
            <span className="px-md font-semibold">1</span>
            <button className="px-md py-sm hover:bg-surface-container" type="button">+</button>
          </div>
          <button
            className="flex-1 bg-primary-container text-on-primary py-md rounded-lg font-bold text-lg hover:bg-primary transition-all active:scale-95"
            type="button"
            onClick={onAddToCart}
          >
            Add to Cart
          </button>
        </div>

        <div className="grid grid-cols-3 gap-md pt-lg border-t border-outline-variant">
          {highlights.map((item) => (
            <div key={item.label} className="text-center space-y-xs">
              <span className="material-symbols-outlined text-headline-md text-secondary">{item.icon}</span>
              <p className="text-label-sm uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TasteAndNutrition() {
  return (
    <section className="mt-xl grid grid-cols-1 lg:grid-cols-2 gap-xl py-xl border-t border-outline-variant">
      <div className="space-y-md">
        <h2 className="font-serif text-headline-lg text-primary">Taste Notes &amp; Description</h2>
        <p className="font-serif text-body-lg text-[#4B3621]/80 leading-relaxed">
          Our Classic Almond Butter is crafted in small batches, where time and temperature are carefully balanced to preserve the natural oils and nutrients. The result is a profile that features notes of <span className="font-bold italic">roasted sweetness</span>, followed by a <span className="font-bold italic">rich, buttery finish</span> that lingers on the palate.
        </p>
        <div className="flex items-center gap-md p-md bg-[#E6D5B8]/20 rounded-lg border border-outline-variant">
          <span className="material-symbols-outlined text-secondary">restaurant_menu</span>
          <p className="font-serif italic text-body-lg">"Roasted, buttery, smooth."</p>
        </div>
        <div className="space-y-sm pt-md">
          <h3 className="text-label-sm font-semibold uppercase tracking-widest">Simple Ingredients</h3>
          <p className="text-body-md">Roasted Almonds, Sea Salt.</p>
        </div>
      </div>

      <div className="bg-[#E6D5B8]/10 p-lg rounded-xl border border-outline-variant">
        <h3 className="font-serif text-headline-md text-primary mb-md">Nutrition Facts</h3>
        <div className="space-y-base border-t border-[#4B3621]/20 pt-base">
          {nutritionFacts.map(([label, value, strong]) => (
            <div key={label} className="flex justify-between py-xs border-b border-[#4B3621]/10">
              <span className={strong ? 'font-bold' : ''}>{label}</span>
              <span className={strong ? 'font-bold' : ''}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WellnessSection() {
  return (
    <section className="py-xl">
      <h2 className="font-serif text-headline-lg text-primary text-center mb-lg">Crafted for Your Wellness</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {benefits.map((item) => (
          <div
            key={item.title}
            className="bg-surface-container p-lg rounded-xl flex flex-col items-center text-center space-y-md border border-transparent hover:border-secondary transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[48px] text-secondary">{item.icon}</span>
            <h3 className="font-serif text-headline-md text-primary">{item.title}</h3>
            <p className="text-body-md text-[#4B3621]/70">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RitualsSection() {
  return (
    <section className="py-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-sm mb-lg">
        <h2 className="font-serif text-headline-lg text-primary">Daily Rituals</h2>
        <p className="text-body-md italic text-[#4B3621]/60">How to enjoy our stone-ground butter</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {rituals.map((item) => (
          <article key={item.title} className="space-y-md group">
            <div className="overflow-hidden rounded-lg aspect-square">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={item.image}
                alt={item.title}
              />
            </div>
            <h3 className="font-serif text-headline-md text-primary">{item.title}</h3>
            <p className="text-body-md text-[#4B3621]/70">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ReviewsSection() {
  return (
    <section className="py-xl border-t border-outline-variant">
      <div className="flex flex-col lg:flex-row gap-xl">
        <div className="lg:w-1/3 space-y-md">
          <h2 className="font-serif text-headline-lg text-primary">Customer Reflections</h2>
          <div className="space-y-xs">
            <p className="font-serif text-headline-xl text-primary">4.9</p>
            <StarRating />
            <p className="text-body-md text-[#4B3621]/60">Based on 124 reviews</p>
          </div>
          <button className="w-full border-2 border-primary py-md rounded-lg font-bold hover:bg-primary-container hover:text-on-primary transition-all" type="button">
            Write a Review
          </button>
        </div>

        <div className="lg:w-2/3 space-y-md">
          {reviews.map((review) => (
            <article key={review.name} className="p-md bg-white/50 rounded-xl space-y-sm border border-outline-variant">
              <div className="flex justify-between items-center gap-sm">
                <span className="font-bold text-body-lg">{review.name}</span>
                <span className="text-label-sm text-[#4B3621]/60">Verified Buyer</span>
              </div>
              <StarRating small />
              <p className="text-body-md italic text-[#4B3621]/80">{review.text}</p>
            </article>
          ))}
          <button className="text-primary font-semibold border-b border-primary hover:text-secondary hover:border-secondary transition-colors" type="button">
            Show more reviews
          </button>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  return (
    <section className="mt-xl py-xl px-lg bg-primary-container text-on-primary rounded-xl text-center space-y-md">
      <h2 className="font-serif text-headline-lg">Join the Artisan Inner Circle</h2>
      <p className="text-body-lg max-w-xl mx-auto opacity-90">
        Receive seasonal recipes, early access to limited edition batches, and a story from our orchard once a month.
      </p>
      <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto pt-md">
        <input
          className="flex-1 bg-transparent border-b-2 border-on-primary px-md py-sm focus:outline-none placeholder:text-white/50"
          placeholder="Email Address"
          type="email"
        />
        <button className="bg-on-primary text-primary-container px-lg py-sm font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors" type="button">
          Subscribe
        </button>
      </div>
    </section>
  )
}

function StarRating({ small = false }) {
  return (
    <div className={`flex text-secondary ${small ? 'text-sm' : ''}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`material-symbols-outlined ${small ? 'scale-75' : ''}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  )
}
