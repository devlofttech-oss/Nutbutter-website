import { FOUNDER_STORY } from '../data/aboutData.js'

export default function FounderStory() {
  return (
    <section className="py-xl px-8 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row-reverse gap-xl items-center">
        <div className="w-full md:w-1/2 space-y-md">
          <span className="text-label-md font-semibold text-secondary tracking-widest uppercase">
            {FOUNDER_STORY.eyebrow}
          </span>
          <h2 className="font-serif text-headline-lg text-primary">{FOUNDER_STORY.title}</h2>
          <p className="font-serif text-body-lg italic text-on-surface-variant">{FOUNDER_STORY.quote}</p>
          <p className="font-serif text-body-md text-on-surface-variant leading-relaxed">{FOUNDER_STORY.body}</p>
          <div className="pt-base">
            <p className="font-serif font-bold text-primary text-headline-md">{FOUNDER_STORY.name}</p>
            <p className="text-label-sm font-semibold text-secondary uppercase tracking-widest">{FOUNDER_STORY.role}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            className="rounded-lg w-full h-[460px] md:h-[600px] object-cover grayscale-[0.35] hover:grayscale-0 transition-all duration-700"
            src={FOUNDER_STORY.image}
            alt="Founder portrait"
          />
        </div>
      </div>
    </section>
  )
}
