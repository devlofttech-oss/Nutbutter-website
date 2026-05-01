import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'

const values = [
  ['eco', '100% Natural', 'Every jar contains only what nature intended. No fillers, no shortcuts, just pure botanical goodness.'],
  ['science', 'No Chemicals', 'We maintain a strict zero-chemical policy. No preservatives, no additives, and no synthetic emulsifiers.'],
  ['verified', 'Honest Ingredients', 'Full transparency from farm to jar. We source only the finest, ethically harvested nuts and seeds.'],
]

const steps = [
  ['01', 'Sourcing', 'Hand-selected heirloom nuts from small-scale family farms.'],
  ['02', 'Roasting', 'Gentle air-roasting to unlock deep, complex flavors without burning.'],
  ['03', 'Grinding', 'Slow-motion stone grinding for 24 hours for silky smooth texture.'],
  ['04', 'Batching', 'Jarred by hand in small batches to ensure absolute freshness.'],
]

export default function AboutPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <header className="pt-32 pb-28 px-6 md:px-12 text-center bg-[#FAF9F6]">
          <div className="max-w-[800px] mx-auto">
            <h1 className="font-serif text-[48px] md:text-[64px] leading-tight text-primary mb-6">Our Story</h1>
            <p className="text-lg leading-8 text-secondary max-w-2xl mx-auto">
              A commitment to natural living and the purity of honest, artisanal ingredients. We believe in the slow, stone-ground journey from soil to spoon.
            </p>
          </div>
        </header>

        {/* Brand Story */}
        <section className="py-[120px] px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-24">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(111,88,60,0.08)] bg-surface-container">
                <img className="w-full h-full object-cover" alt="Stone-ground nut butter" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9GaHny_uB8RhOy-MXNcVOsq7mI9GMIAOIfJ5kpQVfRdLhCrNjbHlNAQxtjXEQKxK1qK7-DerETW_Oep78Ivr1HGk3LA2N6oKoRdMNLZY5RjS2dxuMwSDBQV1SJOSR9V0HwoJ05_mTBSG2CXAJUcAcIpBaIkfamZQ6WpXiZ01RJM-5e2dTCkIg32eS_qJ_GBldt8EtAzBBeu8zLMgCqdHskjTBEuQ0MWfVbbYnrDc_5Q-SX2e40XeQ9bDMRe9lu_j9Jog5U57R4IM" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-tertiary-fixed rounded-full opacity-30 blur-3xl" />
            </div>
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-[0.18em]">The Origin</div>
              <h2 className="font-serif text-4xl text-primary">Clean. Natural. Stone-Ground.</h2>
              <div className="space-y-6 text-lg leading-8 text-on-surface-variant">
                <p>Artisan Nut Co. began in a small home kitchen with a simple observation: the world had forgotten what real food tastes like. Most nut butters were laden with emulsifiers, palm oils, and refined sugars.</p>
                <p>Our mission was clear: return to the roots. We sought out the highest quality nuts from sustainable orchards and revived the ancient art of stone-grinding.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-[120px] px-6 md:px-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl text-primary">Crafted with Intention</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map(([icon, title, body]) => (
                <div key={title} className="bg-surface rounded-[28px] p-10 shadow-[0_20px_60px_rgba(111,88,60,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-8 group-hover:bg-tertiary-fixed transition-colors">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-primary mb-4">{title}</h3>
                  <p className="text-secondary leading-7">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-[120px] px-6 md:px-12">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16 items-center">
            <div className="md:col-span-2">
              <div className="aspect-square rounded-full overflow-hidden border-[12px] border-surface-container-high shadow-[0_20px_60px_rgba(111,88,60,0.08)]">
                <img className="w-full h-full object-cover" alt="Founder portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA31P1Ew9O-w7l74dn_YOtRJn9itwANMuEdOmi-SB0544Q7VUEOlKwk0UUNEcYtHTXBWpAr4eZeyirp-oP-mwj_0nkotKwD1GHzO6G5bGP16xh6k8TvdLvexcfUuQONEDzOETAB4JX1q1mdqjiGybOJJgxUfV3Z4m7Vf_Y_OWXAuzNs4RQ-oJhfpfG7Z-cH0BbH7ocDUdZJrx0PLgisVILRB0Z_qc8V4HV8jdB_H4OpCFHrtvivejphgukjVceDXFXof_OEMz1SSeQ" />
              </div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <span className="material-symbols-outlined text-4xl text-primary/40">format_quote</span>
              <h2 className="font-serif text-4xl text-primary italic">"I wanted to create something my family could eat without question."</h2>
              <p className="text-lg leading-8 text-on-surface-variant">Artisan Nut Co. was born from a personal journey toward simpler food. The secret was not more processing, but less: pure, unadulterated flavors of nature for people who value health and craft.</p>
              <div className="pt-4">
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Elena Vance</p>
                <p className="text-secondary">Founder & Head Maker</p>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Process */}
        <section className="py-[120px] px-6 md:px-12 bg-surface-container-highest">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-4xl text-primary mb-12">The Slow-Ground Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {steps.map(([number, title, body]) => (
                <div key={title} className="space-y-4">
                  <p className="text-primary font-bold text-4xl opacity-20">{number}</p>
                  <h4 className="font-serif text-2xl text-primary">{title}</h4>
                  <p className="text-secondary">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-[120px] px-6 md:px-12 text-center bg-surface relative overflow-hidden">
          <div className="max-w-[600px] mx-auto relative z-10">
            <h2 className="font-serif text-[48px] md:text-[64px] leading-tight text-primary mb-8">Join our journey to healthier living</h2>
            <Link to="/shop" className="inline-block bg-primary text-on-primary px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
              Shop Collection
            </Link>
          </div>
          {/* Decorative Pistachio Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tertiary-fixed rounded-full opacity-10 blur-[100px]" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
