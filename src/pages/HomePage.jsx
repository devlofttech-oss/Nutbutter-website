import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import ProductCard from '../components/ProductCard.tsx'
import { PRODUCTS, TESTIMONIALS } from '../data/constants.js'

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4)

  return (
    <div className="bg-background text-on-surface">
      <Header />

      {/* 1. Hero */}
      <section className="relative overflow-hidden pt-xl pb-lg">
        <div className="max-w-7xl mx-auto px-margin flex flex-col lg:flex-row items-center gap-lg">
          <div className="flex-1 space-y-md">
            <span className="text-sm text-secondary uppercase tracking-widest font-semibold">
              Handcrafted in Small Batches
            </span>
            <h1 className="font-serif text-headline-xl text-primary max-w-lg">
              The Purest Expression of Nature's Bounty.
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-md font-serif">
              Stone-ground, organic nuts transformed into silky, nutrient-dense butters for the modern epicurean.
            </p>
            <div className="pt-sm flex flex-col sm:flex-row gap-sm">
              <Link to="/shop">
                <button className="bg-primary-container text-on-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95">
                  Shop Now
                </button>
              </Link>
              <Link to="/shop#bundles">
                <button className="border border-primary text-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide transition-all hover:bg-surface-container active:scale-95">
                  View Combo Packs
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-secondary-container opacity-20 blur-3xl rounded-full" />
            <img
              src={PRODUCTS[0].image}
              alt="Artisan Nut Butter Jar"
              className="relative z-10 rounded-lg shadow-2xl w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* 2. Featured Products */}
      <section className="bg-surface py-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex justify-between items-end mb-lg">
            <div className="space-y-xs">
              <h2 className="font-serif text-headline-lg text-primary">Signature Collection</h2>
              <p className="text-body-md text-on-surface-variant">Discover our most loved stone-ground creations.</p>
            </div>
            <Link to="/shop" className="flex items-center gap-xs text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              View All <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-lg">
            <Link to="/shop">
              <button className="border border-primary text-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide hover:bg-surface-container transition-colors">
                Browse Full Shop
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="py-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center">
            {[
              { icon: 'spa', title: 'Ethically Sourced', desc: 'We partner directly with family farms to ensure fair trade and regenerative practices.' },
              { icon: 'eco', title: 'Zero Additives', desc: 'No palm oil, refined sugars, or preservatives. Just pure, slow-roasted nuts.' },
              { icon: 'precision_manufacturing', title: 'Small Batch Mills', desc: 'Stone-ground for over 24 hours to achieve an incomparable velvet texture.' },
            ].map((item) => (
              <div key={item.title} className="space-y-sm">
                <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-primary">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h4 className="font-serif text-2xl font-semibold">{item.title}</h4>
                <p className="text-body-md text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Benefits */}
      <section className="bg-surface-container flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-xl lg:p-lg flex flex-col justify-center space-y-md">
          <h2 className="font-serif text-headline-xl text-primary">More than just a spread.</h2>
          <div className="space-y-sm">
            {[
              { title: 'Heart-Healthy Fats:', body: 'Rich in monounsaturated fats for cardiovascular support.' },
              { title: 'Plant-Based Protein:', body: 'A perfect post-workout fuel for muscles.' },
              { title: 'Antioxidant Rich:', body: 'High in Vitamin E and essential minerals.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-base">
                <span className="material-symbols-outlined text-secondary pt-1">check_circle</span>
                <p className="text-body-lg font-serif">
                  <strong className="text-primary">{item.title}</strong> {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-md flex gap-sm flex-wrap">
            <Link to="/about">
              <button className="bg-tertiary-container text-on-tertiary-container px-lg py-sm rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Learn Our Process
              </button>
            </Link>
            <Link to="/shop">
              <button className="bg-primary-container text-on-primary px-lg py-sm rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1 min-h-[500px]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn1c-ltZ-IkHTsAk1o2OdREgzE25K15OHpdtfp4Kj10DBaXr0ng6i-Xez0JxxxPqwmi6jvp6BpdJLjj8l1ltwPa3am9Kp4DsAvmP9He-um91_ODiiV0ZRvx0obnqYF1kHX_yBhdFAvF8sdfh3CFQQCFcdoGzY810XlI_lrsHRZX5JlbB3RpDettcZ4QBZdWL4RUE5gE-tbDPzsJaDbhc8crlwKxbgSRCz900bkxY_5ETANb7igKbakecrJBRXbzaLQv9p9dDEv-nM"
            alt="Healthy Breakfast"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 5. How to Use */}
      <section className="py-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="text-center mb-lg space-y-sm">
            <h2 className="font-serif text-headline-lg text-primary">Elevate Every Meal</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Versatile, delicious, and nutrient-dense. There's no wrong way to enjoy Artisan Nut Co.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
            <RecipeCard img={PRODUCTS[2].image} title="The Morning Toast" large />
            <div className="grid grid-cols-2 gap-md">
              <RecipeCard img="https://lh3.googleusercontent.com/aida-public/AB6AXuC24uXEd6-l4vGGkedO1g6_vFxGsZlu0PmznLeVZUjZoQgI8cVbRBLocqhmrRalHJVVgmeLi5MHJn7_iPdDmpbUviBG01MD1JVrjSOnDA2DqfB1JjzJoGz7k7aUFqcKUxsuWmOYg9M_Hta0utV926GAaBzDuaRRc3eq_WsLfKQz6F3lUeImCF6hJrRNdWEaYdJGGQisCz7FrhhXPP6pyAiNPjit-QH_-WxfkvrsSad2-u--ATIS5_xqduyVoRgnCQZRTQcxFPNsVF4" title="Smoothies" />
              <RecipeCard img={PRODUCTS[4].image} title="Power Oats" />
              <div className="col-span-2">
                <RecipeCard img="https://lh3.googleusercontent.com/aida-public/AB6AXuDvE0fz9J84x4KSxYyFH8MWfAMlhJtefMogOJfgr_NHeNhEYW_Gm_a9ULfVEO54tdm58DSVFkbSBWCxvWh79RYVVUtlaT3FdvIxannBU16j34rsy87glU7YFRIn_swg7DYwCZ4rKEDMV7TrMmg76LTuA8gaWJsH9_pOS57DUvHhjg1SRNZF81pDgIGqXNbtTeYe1zHlbNJ6tZ8f018ikrsi6WFX-kHkPX-Bmq0794uaHOKrNqiUA7YUxVOxr54_bcj-MPx1aTAVsOA" title="Guilt-Free Desserts" wide />
              </div>
            </div>
          </div>
          <div className="text-center mt-lg">
            <Link to="/blog">
              <button className="border border-primary text-primary px-lg py-sm rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors">
                View All Recipes
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Certifications */}
      <section className="bg-surface-dim py-lg border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-margin flex flex-wrap justify-center items-center gap-xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {['USDA Organic', 'Non-GMO Project', 'B-Corp Certified', 'Vegan Society'].map((cert, i) => (
            <div key={cert} className="flex items-center gap-xs text-sm font-semibold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined">{['verified','psychology_alt','public','done_all'][i]}</span>
              {cert}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin">
          <h2 className="font-serif text-headline-lg text-primary mb-lg">Loved by Real People</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-surface-bright p-lg rounded-xl border border-outline-variant">
                <div className="flex gap-xs text-secondary mb-sm">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-body-md text-primary italic mb-md font-serif">{t.text}</p>
                <div className="flex items-center gap-sm">
                  <div className={`w-12 h-12 rounded-full ${t.avatarBg}`} />
                  <div>
                    <p className="text-sm font-semibold text-primary">{t.name}</p>
                    <p className="text-xs text-on-surface-variant uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Offers */}
      <section id="bundles" className="py-xl bg-primary-container text-on-primary">
        <div className="max-w-7xl mx-auto px-margin grid grid-cols-1 lg:grid-cols-2 gap-xl">
          <BundleCard
            tag="Value Pack" title="The Taster Bundle"
            desc="Three of our most popular flavors (200g each) for a perfect introduction to artisan butters."
            price="₹1,199" original="₹1,499" saving="Save 20%"
            cta="Add Bundle to Cart" href="/cart"
            btnClass="bg-primary text-on-primary border border-white/20 hover:bg-white hover:text-primary"
          />
          <BundleCard
            tag="Membership" title="Butter Club Subscription"
            desc="Save 15% on every jar and get exclusive access to seasonal limited-edition flavors."
            bullets={['Free shipping on all orders', 'Cancel or skip anytime', 'Early access to new drops']}
            cta="Join the Club" href="/checkout"
            btnClass="bg-secondary text-on-secondary hover:opacity-90"
          />
        </div>
      </section>

      {/* 9. Blog Preview */}
      <section className="py-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex justify-between items-end mb-lg">
            <h2 className="font-serif text-headline-lg text-primary">Stories From The Grove</h2>
            <Link to="/blog" className="flex items-center gap-xs text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              All Posts <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {[
              {
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxk5omx6c0IL4fd8krV1yYY4uuRusHcU7h1wBdstj1OAgYHq_Lx4L2WC5WWsvt7vd1boE5hzavvp7ApokvDziYPhHw9G3eqBy_ANULsp6V7N9Swq87hYjwW5bNrXqeDRqyro1GB6f9jryQx3BSebFVnf3WJcebYOpkWGvsNSmGw2KKsBZyNWFnrV4lkDt40_Jl-Mnig1j-UgNXPeNnAXO6TETdOzJ3p8VGFu92sQ2SsY1k212K3d12MaItuDO_EyFiQSFKlhE3hrU',
                tag: 'Sustainability • 5 min read', title: 'Regenerative Farming: Beyond Organic',
                desc: 'How we\'re working with farmers to restore soil health and biodiversity in our almond orchards.',
              },
              {
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGy-I-9aG6S1fBIkDeD0ZCOHX1zO5Vy3yvzYnnNP-DOn0kp765yqPV5CB6ZPfULFccZLPBf0jPL9AT8pu4LrMRsLoXORv0UEQsBfXIsC4vNr8Tvo2brfLkgYeEnK8FRgJIhDXPHRwr_YgQVZb_RYyydoJ2O5tVndApZpFZVKwte0bUejwzbUBXUCSjNW7qgEpBtxiPKD0UQ_lE8uP4SFEW69dV0zkVSLvtzoMaiteUh0J0ThRaHvR7YXNlAf15gQrB-ffrp1GsXWM',
                tag: 'Nutrition • 4 min read', title: 'The Science of Stone Grinding',
                desc: 'Why traditional cold-milling preserves more nutrients and flavor than high-speed industrial processing.',
              },
            ].map((post) => (
              <article key={post.title} className="group">
                <Link to="/blog">
                  <div className="h-80 rounded-xl overflow-hidden mb-md">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="space-y-sm">
                  <span className="text-xs text-secondary font-semibold">{post.tag}</span>
                  <h4 className="font-serif text-2xl font-semibold text-primary">{post.title}</h4>
                  <p className="text-body-md text-on-surface-variant">{post.desc}</p>
                  <Link to="/blog" className="inline-block text-sm font-semibold text-primary underline underline-offset-4">
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="py-xl px-margin">
        <div className="max-w-7xl mx-auto bg-surface-container rounded-3xl p-xl text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b3621 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 max-w-2xl mx-auto space-y-md">
            <h2 className="font-serif text-headline-xl text-primary">Bring Artisan Quality to Your Table</h2>
            <p className="text-body-lg text-on-surface-variant">
              Sign up for our newsletter and receive 10% off your first order, plus recipes and artisanal insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-sm max-w-md mx-auto pt-sm">
              <input
                className="flex-1 bg-surface-bright border border-outline-variant rounded-lg px-md py-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Email address"
                type="email"
              />
              <button className="bg-primary text-on-primary px-lg py-sm rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Get 10% Off
              </button>
            </div>
            <div className="pt-sm">
              <Link to="/shop">
                <button className="border border-primary text-primary px-lg py-sm rounded-lg text-sm font-semibold hover:bg-surface-container-high transition-colors">
                  Shop Now →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Small sub-components used only in HomePage ── */

function RecipeCard({ img, title, large = false, wide = false }) {
  return (
    <div className="relative group">
      <div className={`overflow-hidden rounded-xl ${large ? 'aspect-square' : wide ? '' : 'aspect-square'}`}
        style={wide ? { aspectRatio: '2/1' } : {}}>
        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute bottom-0 left-0 p-md w-full bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
        <h5 className="font-serif text-xl font-semibold text-white">{title}</h5>
        <a href="/blog" className="text-xs text-white/80 underline">See Recipe →</a>
      </div>
    </div>
  )
}

function BundleCard({ tag, title, desc, price, original, saving, bullets, cta, href, btnClass }) {
  return (
    <div className="p-lg rounded-xl border space-y-md" style={{ background: 'rgba(231,226,217,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
      <span className="text-xs text-secondary-fixed uppercase tracking-tighter font-semibold">{tag}</span>
      <h3 className="font-serif text-headline-lg">{title}</h3>
      <p className="text-body-lg opacity-80">{desc}</p>
      {price && (
        <div className="flex items-center gap-md">
          <span className="font-serif text-headline-lg">{price}</span>
          <span className="line-through opacity-40">{original}</span>
          <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-2 py-1 rounded">{saving}</span>
        </div>
      )}
      {bullets && (
        <ul className="space-y-xs text-body-md opacity-80">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">check</span> {b}
            </li>
          ))}
        </ul>
      )}
      <Link to={href}>
        <button className={`w-full py-sm rounded-lg text-sm font-semibold transition-all ${btnClass}`}>{cta}</button>
      </Link>
    </div>
  )
}
