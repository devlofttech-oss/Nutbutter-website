import { CUSTOMER_FIELDS } from '../data/checkoutData.js'

export default function CheckoutForm({ values, errors = {}, title = 'Customer Details', onChange }) {
  return (
    <section className="space-y-md">
      <h2 className="font-serif text-headline-md text-primary flex items-center gap-base border-b border-outline-variant pb-base">
        <span className="material-symbols-outlined">person_outline</span>
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {CUSTOMER_FIELDS.map((field) => (
          <label key={field.name} className={`space-y-xs ${field.wide ? 'md:col-span-2' : ''}`}>
            <span className="block text-label-md font-semibold text-primary-container">{field.label}</span>
            <input
              className={`w-full bg-surface-container border focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-lg px-md py-sm text-body-md ${
                errors[field.name] ? 'border-error' : 'border-transparent focus:border-secondary'
              }`}
              name={field.name}
              placeholder={field.placeholder}
              type={field.type}
              value={values[field.name]}
              onChange={onChange}
            />
            {errors[field.name] && <span className="block text-label-sm text-error">{errors[field.name]}</span>}
          </label>
        ))}
      </div>
    </section>
  )
}
