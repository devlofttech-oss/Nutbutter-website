import { CONTACT_FIELDS } from '../data/contactData.js'

export default function ContactForm({ values, errors, submitted, onChange, onSubmit }) {
  return (
    <form
      className="bg-surface-bright p-lg rounded-xl border border-outline-variant shadow-sm"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="space-y-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {CONTACT_FIELDS.slice(0, 2).map((field) => (
            <Field key={field.name} field={field} value={values[field.name]} error={errors[field.name]} onChange={onChange} />
          ))}
        </div>

        <Field field={CONTACT_FIELDS[2]} value={values.phone} error={errors.phone} onChange={onChange} />

        <label className="space-y-xs block">
          <span className="block text-label-sm font-semibold text-secondary uppercase tracking-widest px-base">
            Message
          </span>
          <textarea
            className={`w-full bg-surface-container border rounded-lg p-md focus:outline-none focus:ring-2 focus:ring-secondary/20 text-primary placeholder:text-outline resize-none ${
              errors.message ? 'border-error' : 'border-transparent focus:border-secondary'
            }`}
            name="message"
            placeholder="Tell us about your inquiry..."
            rows="6"
            value={values.message}
            onChange={onChange}
          />
          {errors.message && <span className="block text-label-sm text-error px-base">{errors.message}</span>}
        </label>

        <button
          className="w-full py-md bg-primary-container text-on-primary font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm uppercase tracking-widest text-label-md"
          type="submit"
        >
          Send Message
          <span className="material-symbols-outlined text-sm">send</span>
        </button>

        {submitted && (
          <p className="text-center text-label-md font-semibold text-secondary">
            Message received. Our team will reply shortly.
          </p>
        )}
      </div>
    </form>
  )
}

function Field({ field, value, error, onChange }) {
  return (
    <label className="space-y-xs block">
      <span className="block text-label-sm font-semibold text-secondary uppercase tracking-widest px-base">
        {field.label}{!field.required ? ' (Optional)' : ''}
      </span>
      <input
        className={`w-full bg-surface-container border rounded-lg p-md focus:outline-none focus:ring-2 focus:ring-secondary/20 text-primary placeholder:text-outline ${
          error ? 'border-error' : 'border-transparent focus:border-secondary'
        }`}
        name={field.name}
        placeholder={field.placeholder}
        type={field.type}
        value={value}
        onChange={onChange}
      />
      {error && <span className="block text-label-sm text-error px-base">{error}</span>}
    </label>
  )
}
