import { BRAND_STORY } from '../data/aboutData.js'

export default function BrandStory() {
  return (
    <section className="py-xl px-8 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
        <div className="space-y-md">
          <span className="text-label-md font-semibold text-secondary tracking-widest uppercase">
            {BRAND_STORY.eyebrow}
          </span>
          <h2 className="font-serif text-headline-lg text-primary">{BRAND_STORY.title}</h2>
          {BRAND_STORY.body.map((paragraph) => (
            <p key={paragraph} className="font-serif text-body-lg text-on-surface-variant leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 border border-tertiary opacity-20 rounded-lg translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
          <img
            className="rounded-lg shadow-xl relative z-10 w-full h-[420px] md:h-[500px] object-cover"
            src={BRAND_STORY.image}
            alt="Natural ingredients display"
          />
        </div>
      </div>
    </section>
  )
}
