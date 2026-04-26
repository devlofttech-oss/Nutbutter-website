import { PROCESS_STEPS } from '../data/aboutData.js'

export default function ProcessSection() {
  return (
    <section className="bg-surface-dim/30 py-xl">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="text-center mb-xl">
          <h2 className="font-serif text-headline-lg text-primary">The Slow Craft</h2>
          <p className="font-serif text-body-md text-on-surface-variant max-w-2xl mx-auto mt-xs">
            Time is our most important ingredient. We refuse to rush the transformation from nut to butter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {PROCESS_STEPS.map((step, index) => (
            <article
              key={step.number}
              className={`bg-surface p-lg rounded-xl border border-outline-variant shadow-sm hover:-translate-y-1 transition-transform duration-300 ${
                index % 2 === 1 ? 'md:translate-y-base' : ''
              }`}
            >
              <span className="text-primary-container text-headline-md font-bold mb-sm block opacity-20">
                {step.number}
              </span>
              <h3 className="font-serif text-headline-md text-primary mb-sm">{step.title}</h3>
              <p className="text-label-md text-on-surface-variant">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
