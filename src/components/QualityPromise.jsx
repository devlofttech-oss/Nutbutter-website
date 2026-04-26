import { QUALITY_PROMISES } from '../data/aboutData.js'

export default function QualityPromise() {
  return (
    <section className="py-xl px-8 md:px-12 max-w-7xl mx-auto text-center">
      <h2 className="font-serif text-headline-lg text-primary mb-xl">Our Unwavering Promise</h2>
      <div className="flex flex-wrap justify-center gap-xl">
        {QUALITY_PROMISES.map((promise) => (
          <article key={promise.title} className="flex flex-col items-center max-w-[220px]">
            <div className="w-20 h-20 rounded-full bg-tertiary-fixed flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary text-3xl">{promise.icon}</span>
            </div>
            <h3 className="font-serif text-body-lg font-semibold text-primary mb-xs">{promise.title}</h3>
            <p className="text-label-sm text-on-surface-variant">{promise.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
