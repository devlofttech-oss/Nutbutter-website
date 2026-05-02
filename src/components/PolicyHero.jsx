export default function PolicyHero({ policy }) {
  return (
    <section className="py-14 md:py-xl px-4 sm:px-6 md:px-8 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-label-md font-semibold text-secondary mb-4 tracking-widest uppercase">
          {policy.eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-headline-xl text-primary mb-6">{policy.title}</h1>
        <p className="text-base md:text-body-lg leading-7 text-on-surface-variant italic">
          {policy.effectiveDate}. {policy.intro}
        </p>
        <div className="mt-lg w-24 h-px bg-outline-variant mx-auto" />
      </div>
    </section>
  )
}
