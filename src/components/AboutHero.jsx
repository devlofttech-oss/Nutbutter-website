import { ABOUT_HERO } from '../data/aboutData.js'

export default function AboutHero() {
  return (
    <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover brightness-75 grayscale-[0.2]"
          src={ABOUT_HERO.image}
          alt="Stone-ground nut butter textures"
        />
        <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
      </div>
      <div className="relative z-10 text-center px-gutter max-w-4xl">
        <span className="text-label-md font-semibold text-white/80 uppercase tracking-widest">
          {ABOUT_HERO.eyebrow}
        </span>
        <h1 className="font-serif text-headline-xl text-white mt-sm mb-md drop-shadow-sm">
          {ABOUT_HERO.title}
        </h1>
        <p className="font-serif text-body-lg text-white/90 italic max-w-2xl mx-auto">
          {ABOUT_HERO.subtitle}
        </p>
      </div>
    </section>
  )
}
