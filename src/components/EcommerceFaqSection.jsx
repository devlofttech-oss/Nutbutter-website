import FaqAccordion from './FaqAccordion.jsx'
import { FAQ_SECTIONS } from '../data/faqData.js'

const previewSections = FAQ_SECTIONS.map((section) => ({
  ...section,
  items: section.items.slice(0, 2),
}))

export default function EcommerceFaqSection({ title = 'Frequently Asked Questions' }) {
  return (
    <section className="border-t border-outline-variant/40 pt-16 pb-24">
      <div className="mb-10 max-w-2xl">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Need a hand?</span>
        <h2 className="font-serif text-4xl leading-tight text-primary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {previewSections.map((section) => (
          <FaqAccordion key={section.id} section={section} />
        ))}
      </div>
    </section>
  )
}
