import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import FaqHero from '../components/FaqHero.jsx'
import FaqCategoryNav from '../components/FaqCategoryNav.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import FaqCTA from '../components/FaqCTA.jsx'
import { FAQ_SECTIONS } from '../data/faqData.js'

export default function FaqPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-12 md:py-xl">
        <FaqHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-xl">
          <FaqCategoryNav sections={FAQ_SECTIONS} />

          <div className="lg:col-span-9 space-y-xl">
            {FAQ_SECTIONS.map((section) => (
              <FaqAccordion key={section.id} section={section} />
            ))}
            <FaqCTA />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
