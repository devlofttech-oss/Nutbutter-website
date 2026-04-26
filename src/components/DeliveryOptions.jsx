import { DELIVERY_OPTIONS } from '../data/checkoutData.js'

export default function DeliveryOptions({ selectedDelivery, onChange }) {
  return (
    <section className="space-y-md">
      <h2 className="font-serif text-headline-md text-primary flex items-center gap-base border-b border-outline-variant pb-base">
        <span className="material-symbols-outlined">local_shipping</span>
        Delivery Method
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {DELIVERY_OPTIONS.map((option) => {
          const selected = selectedDelivery === option.id
          return (
            <label
              key={option.id}
              className={`relative flex cursor-pointer rounded-xl border-2 p-md bg-surface-bright transition-all ${
                selected ? 'border-secondary shadow-lg' : 'border-outline-variant hover:border-secondary'
              }`}
            >
              <input
                checked={selected}
                className="sr-only"
                name="delivery"
                type="radio"
                value={option.id}
                onChange={(event) => onChange(event.target.value)}
              />
              <div className="flex-grow pr-lg">
                <div className="flex items-center justify-between gap-sm">
                  <span className="text-label-md font-semibold text-primary">{option.title}</span>
                  <span className="text-label-md font-semibold text-primary">{formatCurrency(option.price)}</span>
                </div>
                <p className="text-label-sm text-on-surface-variant mt-xs">{option.description}</p>
              </div>
              {selected && (
                <span className="absolute top-md right-md material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </label>
          )
        })}
      </div>
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
