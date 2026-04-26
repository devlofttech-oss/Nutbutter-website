import { useState } from 'react'

export default function FaqAccordion({ section }) {
  const [openItemId, setOpenItemId] = useState(section.items[0]?.id ?? null)

  const toggleItem = (itemId) => {
    setOpenItemId((currentId) => (currentId === itemId ? null : itemId))
  }

  return (
    <section className="scroll-mt-32" id={section.id}>
      <div className="flex items-center gap-4 mb-lg">
        <span className="material-symbols-outlined text-secondary text-3xl">{section.icon}</span>
        <h2 className="font-serif text-headline-lg text-primary">{section.title}</h2>
      </div>

      <div className="space-y-4">
        {section.items.map((item) => {
          const isOpen = openItemId === item.id

          return (
            <article
              key={item.id}
              className="bg-surface-container-low rounded-xl border border-outline-variant transition-all hover:bg-surface-container"
            >
              <button
                aria-controls={`${item.id}-answer`}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-md p-6 text-left cursor-pointer"
                type="button"
                onClick={() => toggleItem(item.id)}
              >
                <span className="font-serif text-headline-md text-primary leading-tight">{item.question}</span>
                <span
                  className={`material-symbols-outlined text-secondary transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-6 pb-6 text-body-md text-on-surface-variant border-t border-outline-variant pt-4"
                  id={`${item.id}-answer`}
                >
                  {item.answer}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
