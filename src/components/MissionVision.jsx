import { MISSION_VISION } from '../data/aboutData.js'

export default function MissionVision() {
  return (
    <section className="bg-surface-container py-xl">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 border border-outline-variant rounded-xl overflow-hidden bg-surface shadow-sm">
          {MISSION_VISION.map((item, index) => (
            <article
              key={item.title}
              className={`p-lg md:p-xl flex flex-col justify-center text-center ${
                index === 0 ? 'border-b md:border-b-0 md:border-r border-outline-variant' : ''
              }`}
            >
              <span className="material-symbols-outlined text-secondary text-4xl mb-sm">{item.icon}</span>
              <h3 className="font-serif text-headline-md text-primary mb-md">{item.title}</h3>
              <p className="font-serif text-body-lg italic text-on-surface-variant">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
