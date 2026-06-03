import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'

const values = [
  ['grain', 'Traditionally Stone-Ground', 'Slow stone grinding preserves natural oils, nutrients, flavour, and texture for a richer, more authentic experience.'],
  ['verified', 'Clean Ingredients', 'No added refined sugar, no preservatives, and no artificial additives. Just thoughtfully selected ingredients.'],
  ['inventory_2', 'Small-Batch Crafted', 'Made in limited batches to ensure freshness, consistency, and quality in every jar.'],
  ['eco', 'Plant-Based Goodness', 'Wholesome vegetarian spreads crafted for everyday nourishment and conscious living.'],
  ['fitness_center', 'Protein & Nutrient Rich', 'Perfect for mindful snacking, smoothies, breakfast bowls, and guilt-free indulgence.'],
  ['restaurant', 'Gourmet Functional Flavours', 'Inspired by global flavours, Indian spices, and everyday wellness.'],
]

const steps = [
  ['01', 'Retain', 'Natural oils and nutrients stay intact through patient stone grinding.'],
  ['02', 'Enhance', 'The slow process deepens flavour and aroma without heavy processing.'],
  ['03', 'Texture', 'Stone grinding creates a richer, silkier butter with authentic character.'],
  ['04', 'Preserve', 'The integrity of nuts and seeds is protected naturally.'],
]

const signatureButters = [
  ['Masala Peanut Butter', 'Stone-ground roasted peanuts blended with red chilli, curry leaves, asafoetida, and cold-pressed peanut oil for a bold savoury kick.'],
  ['Herby Cashew Butter', 'Creamy stone-ground cashews infused with herbs and cracked pepper for a smooth savoury experience.'],
  ['Peri Peri Almond Butter', 'A fiery fusion of premium almonds and smoky peri peri seasoning.'],
  ['Zesty Cacao Almond Butter', 'Rich cacao meets slow stone-ground almonds in this deeply indulgent chocolatey spread.'],
  ['Hazelnut Nutella Butter', 'Luxuriously creamy hazelnuts crafted into a decadent, dessert-inspired spread with a velvety finish.'],
  ['Royal Pistachio Butter', 'Stone-ground pistachios elevated with saffron and subtle white pepper notes for a refined gourmet touch.'],
  ['Omega Seed Butter', 'A nourishing blend of pumpkin, sunflower, flax, hemp, and chia seeds packed with wholesome nutrition.'],
  ['Minty Pumpkin Seed Butter', 'Roasted pumpkin seeds balanced with refreshing mint for a uniquely flavourful spread.'],
]

const servingIdeas = [
  'Toasts & crackers',
  'Smoothies & smoothie bowls',
  'Fruits & desserts',
  'Overnight oats',
  'Healthy baking recipes',
  'Energy snacks',
  'Straight from the jar',
]

export default function AboutPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <header className="pt-20 md:pt-32 pb-16 md:pb-28 px-4 sm:px-6 md:px-12 text-center bg-[#FAF9F6]">
          <div className="max-w-[800px] mx-auto">
            <h1 className="font-serif text-[38px] sm:text-[44px] md:text-[64px] leading-tight text-primary mb-5 md:mb-6">About</h1>
            <p className="text-base md:text-lg leading-7 md:leading-8 text-secondary max-w-2xl mx-auto">
              Redefining nut butters with bold savoury flavours, stone-ground craft, and a home-grown spirit.
            </p>
          </div>
        </header>

        {/* Brand Story */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-24">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(111,88,60,0.08)] bg-surface-container">
                <img className="w-full h-full object-cover" alt="Stone-ground nut butter" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9GaHny_uB8RhOy-MXNcVOsq7mI9GMIAOIfJ5kpQVfRdLhCrNjbHlNAQxtjXEQKxK1qK7-DerETW_Oep78Ivr1HGk3LA2N6oKoRdMNLZY5RjS2dxuMwSDBQV1SJOSR9V0HwoJ05_mTBSG2CXAJUcAcIpBaIkfamZQ6WpXiZ01RJM-5e2dTCkIg32eS_qJ_GBldt8EtAzBBeu8zLMgCqdHskjTBEuQ0MWfVbbYnrDc_5Q-SX2e40XeQ9bDMRe9lu_j9Jog5U57R4IM" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-tertiary-fixed rounded-full opacity-30 blur-3xl" />
            </div>
            <div className="space-y-6 md:space-y-8">
              <div className="inline-block px-4 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-[0.18em]">About Satvegik</div>
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-primary">India's New-Age Savoury Nut Butter Brand</h2>
                <p className="text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant">
                  At Satvegik, we are redefining the world of nut butters with a bold, savoury twist.
                </p>
              </div>
              <div className="space-y-5 text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant">
                <p>
                  While most nut butters lean sweet, we proudly stand among the first home-grown brands to introduce a thoughtfully crafted range of stone-ground savoury nut and seed butters - created for Indian palates, mindful lifestyles, and adventurous food lovers.
                </p>
                <p>
                  From spicy and herby to rich and indulgent, there is truly something for everybody.
                </p>
                <p>
                  Satvegik was born from the idea that nut butters can be more than just sweet spreads. Our unique flavour combinations bring together global inspiration, Indian spices, and functional nutrition to create an entirely new snacking experience.
                </p>
                <p>
                  Whether it is the fiery warmth of Masala Peanut, the richness of Herby Cashew, or the bold kick of Peri Peri Almond - every jar is crafted to surprise, nourish, and delight.
                </p>
              </div>
              <div className="rounded-[22px] md:rounded-[28px] bg-surface-container-low border border-outline-variant p-5 md:p-6">
                <h3 className="font-serif text-2xl text-primary mb-4">One of Its Kind</h3>
                <p className="text-on-surface-variant leading-7 mb-5">
                  We are proud to be among the early brands in the industry bringing a dedicated range of gourmet savoury nut butters to the market.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Unique and thoughtfully curated',
                    'Crafted for both taste and nutrition',
                    'Designed for everyday versatility',
                    'Made to suit diverse flavour preferences',
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-full bg-white/70 px-4 py-3 text-sm font-medium text-secondary">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-on-surface-variant leading-7">
                  From savoury lovers to chocolate enthusiasts, from fitness-conscious eaters to mindful snackers - Satvegik has a jar for every palate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] block mb-4">Why Satvegik?</span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Crafted with Intention</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map(([icon, title, body]) => (
                <div key={title} className="bg-surface rounded-[22px] md:rounded-[28px] p-7 md:p-10 shadow-[0_20px_60px_rgba(111,88,60,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
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

        {/* Signature Butters */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-10 md:mb-16">
              <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] block mb-4">Explore Our Signature Butters</span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Gourmet flavours for everyday wellness</h2>
              <p className="mt-5 text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant">
                Each blend is designed with a clear flavour personality, from savoury spice to dessert-inspired indulgence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {signatureButters.map(([title, body]) => (
                <article key={title} className="rounded-[22px] md:rounded-[28px] border border-outline-variant bg-surface-container-low p-6 md:p-8">
                  <h3 className="font-serif text-2xl text-primary mb-3">{title}</h3>
                  <p className="text-secondary leading-7">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Manufacturing Process */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12 bg-surface-container-highest">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] block mb-4">The Art of Stone Grinding</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-5">Great food deserves patience</h2>
            <p className="text-base md:text-lg leading-7 md:leading-8 text-secondary max-w-3xl mx-auto mb-10 md:mb-12">
              At Satvegik, we embrace the traditional method of stone grinding because it creates a butter that tastes authentic, wholesome, and beautifully handcrafted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
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

        {/* Usage Ideas */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] block mb-4">More Than Just a Spread</span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Spread it. Dip it. Blend it. Spoon it.</h2>
              <p className="text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant">
                Satvegik butters fit beautifully into modern lifestyles, whether you are health-conscious, fitness-focused, vegan-curious, or simply someone who appreciates clean, artisanal food.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servingIdeas.map((idea) => (
                <div key={idea} className="flex items-center gap-3 rounded-full bg-surface px-5 py-4 border border-outline-variant">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="text-secondary font-medium">{idea}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 md:py-[120px] px-4 sm:px-6 md:px-12 text-center bg-surface relative overflow-hidden">
          <div className="max-w-[600px] mx-auto relative z-10">
            <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em] block mb-4">Crafted for Conscious Living</span>
            <h2 className="font-serif text-[34px] sm:text-[40px] md:text-[64px] leading-tight text-primary mb-6">Stone-Ground. Wholesome. Gourmet. Honest.</h2>
            <p className="text-base md:text-lg leading-7 md:leading-8 text-secondary mb-8">
              Every Satvegik jar reflects our passion for honest ingredients, traditional craftsmanship, and elevated everyday nourishment.
            </p>
            <Link to="/shop" className="inline-block bg-primary text-on-primary px-8 md:px-12 py-4 md:py-5 rounded-full text-xs font-bold uppercase tracking-[0.16em] md:tracking-[0.18em] hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
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
