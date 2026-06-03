import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'

const recipes = [
  ['Power Toast with Almond Butter', 'Breakfast', '5 min', 'A classic morning ritual with berries, seeds, and a generous almond butter layer.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAdmQXEyO5EVCpsvYQI3AIGPe2NAYKzGGS8qpCNVMNO-B75637yEXU8piT8xhJOLDOju4Nt3BLX4eQcHJEr7DzEGialIU_VFHQjEEyF08N6Cz9Mo-yWpkPIyNilF0MMpnHA9iX-FTaFDtzqI6twD_Rgx_Uo1qhW4urKI7p-krFMH_flOuecYg4df8eAOj-xP0yW3RWdeFVNA4siPSRbnrbEvqR5ooDXXc8OZDRgcGH9UYG8-Tmb-aymXtJU60ASAE34NzbFxl9nDs'],
  ['Green Protein Smoothie', 'Fitness', '8 min', 'Blend greens, banana, and cashew butter for a creamy, plant-powered boost.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfwNgtHDMo9NBcaew5nQpiCxfaoctvA5NRwsOzuIITafNGoHPNM3iaGpDGqYR1r_446Ein3ifdELZmEkskFUfFxwe5yrjKDTixuSILc4zHRzVpE8SAJcwm2VdN6CRxs6MHHDUNlUBrbiX1nkNkQjtSdqJfWPACs0lNa6tz31ewx8aEKbLLXq81jMUNQEnNR1lyER7SqBis3Py8a_SpjeedEW95_LFxXZh0KGOnWwRs9ZUpV9yok1VTQ8lx3xMyFf1lGLV4ORkuhO0'],
  ['Apple Almond Snack Plate', 'Snack', '4 min', 'Crisp apple slices with silky nut butter and a touch of cinnamon.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK8Rl8T9uwOPMwVZM9jG0BFTScqrPdKksPdWJbCKpc_dnZjN0-Lw9-LMgrqvbRfvf8PXMR1-9zg1JdFWUeONyFAwkKPnYK-VGpCyho1mrt-x-nsy41pxvfYxdtD05AHP5qC1agDZUDIe0vA6qJ2MFDmtjbLEzFxVcq1LsklU3b3zXS3uumx_eGyOXXqqAMo6E3nSYITda7aW0og94Olc0rcUE6pld21ChfkXSnkAIYhCCniFv88hvQUOz-aAWjtS1gYFiuiLU4ZjQ'],
  ['Cacao Hazelnut Brownies', 'Dessert', '35 min', 'A rich dessert with deep cacao notes and no added refined sugar.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80'],
  ['Satay Peanut Noodles', 'Lunch', '20 min', 'Creamy peanut butter becomes a savory sauce for quick weeknight noodles.', 'https://unsplash.com/photos/w2be16nG68k/download?force=true&w=1200'],
  ['Overnight Oats with Seed Butter', 'Meal Prep', 'Overnight', 'A prepared breakfast that is simple, satisfying, and naturally rich.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXus-xMZcZT4NEqt21Ur2jY-VS0zu9PoANZbtZ0bremy-ggSld08e-SKZ1LLyoo-iwNBo_9lWKdSdiR3hPuNp0URLaDX1UaWq5QoJXS4GUxIRk2c0d-80r9MYugCiEm4KaNqzfQUEXkbVYcT5ipilkPXjjQzs0vHsa2TERHVlbo9SgJBokCaC7NKz9duJGzq60qS_RfgX5NBUzS5nMg7yPC4jEQmpGoUMmwJtX5FkSH--ovbW7LqodoqG_5kcuUL-sRNNpAl6DyaA'],
]

export default function BlogPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header />
      <main className="pt-10 md:pt-20">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-14 md:py-24 text-center">
          <h1 className="font-serif text-[38px] sm:text-[44px] md:text-[64px] leading-tight text-on-surface mb-5 md:mb-6">Healthy Recipes</h1>
          <p className="text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant max-w-2xl mx-auto">
            Simple, nourishing ways to enjoy our stone-ground nut butters every day.
          </p>
        </section>

        {/* Recipe Grid */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map(([title, tag, time, body, image], index) => (
            <article key={title} className={`bg-white rounded-[22px] md:rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(111,88,60,0.08)] flex flex-col ${index === 0 ? 'lg:col-span-2' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" src={image} />
              </div>
              <div className="p-5 md:p-8 flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-xs font-bold rounded-full">{tag}</span>
                  <span className="px-3 py-1 bg-secondary-fixed/50 text-on-secondary-fixed-variant text-xs font-bold rounded-full">{time}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-on-surface mb-3">{title}</h3>
                <p className="text-on-surface-variant mb-8 flex-grow leading-7">{body}</p>
                <button className="w-full py-4 bg-primary text-on-primary text-xs font-bold tracking-[0.18em] uppercase rounded-full hover:bg-primary/90 transition-colors" type="button">View Recipe</button>
              </div>
            </article>
          ))}
        </section>

        {/* Call to Action Section */}
        <section className="max-w-[1440px] mx-4 sm:mx-6 md:mx-auto px-5 md:px-12 py-16 md:py-[120px] bg-secondary-container/20 text-center rounded-[24px] md:rounded-[32px] my-12 md:my-16">
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-5 md:mb-6">Share Your Creations</h2>
          <p className="text-base md:text-lg leading-7 text-on-surface-variant mb-8 md:mb-10 max-w-xl mx-auto">
            We love seeing how you use Satvegik. Tag us in your kitchen moments for a chance to be featured.
          </p>
          <a className="inline-flex items-center gap-3 text-xs font-bold text-primary uppercase tracking-[0.18em] border-b-2 border-primary pb-1 hover:gap-5 transition-all" href="https://instagram.com">
            Follow us on Instagram <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
