import { CONTACT_INFO } from '../data/contactData.js'

export default function ContactInfo() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-md">
      {CONTACT_INFO.map((item) => (
        <article key={item.title} className="p-md bg-surface-container rounded-lg border border-outline-variant">
          <span className="material-symbols-outlined text-primary mb-base">{item.icon}</span>
          <h2 className="text-label-md font-semibold text-primary mb-xs uppercase tracking-widest">
            {item.title}
          </h2>
          {item.lines.map((line) => (
            <p key={line} className="text-body-md text-secondary">{line}</p>
          ))}
        </article>
      ))}
    </section>
  )
}
