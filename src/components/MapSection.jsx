import { MAP_DETAILS } from '../data/contactData.js'

export default function MapSection() {
  return (
    <section className="w-full h-[500px] relative mt-xl">
      <div className="absolute inset-0 bg-surface-container">
        <img
          className="w-full h-full object-cover grayscale opacity-50 contrast-125"
          src={MAP_DETAILS.image}
          alt="Stylized map of the studio location"
        />
        <div className="absolute inset-0 bg-primary/5" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="bg-surface-bright p-md rounded-xl border border-outline-variant shadow-xl flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
          </div>
          <div>
            <p className="text-label-md font-semibold text-primary">{MAP_DETAILS.title}</p>
            <p className="text-xs text-secondary">{MAP_DETAILS.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
