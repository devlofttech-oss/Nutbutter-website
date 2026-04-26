import { PAYMENT_OPTIONS } from '../data/checkoutData.js'

export default function PaymentOptions({ selectedPayment, onChange }) {
  return (
    <section className="space-y-md">
      <h2 className="font-serif text-headline-md text-primary flex items-center gap-base border-b border-outline-variant pb-base">
        <span className="material-symbols-outlined">account_balance_wallet</span>
        Payment
      </h2>

      <div className="space-y-sm">
        {PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-md p-md rounded-xl cursor-pointer border transition-colors ${
              selectedPayment === option.id
                ? 'bg-surface-container-high border-secondary'
                : 'bg-surface-container border-transparent hover:border-outline-variant'
            }`}
          >
            <input
              checked={selectedPayment === option.id}
              className="w-5 h-5"
              name="payment"
              type="radio"
              value={option.id}
              onChange={(event) => onChange(event.target.value)}
              style={{ accentColor: '#33210d' }}
            />
            <div className="flex-grow flex items-center justify-between">
              <span className="text-label-md font-semibold text-primary">{option.title}</span>
              <span className="material-symbols-outlined text-on-surface-variant">{option.icon}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}
