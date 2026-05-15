const PAYMENT_OPTIONS = [
  {
    id: 'phonepe',
    title: 'PhonePe Secure Checkout',
    icon: 'account_balance_wallet',
    description: 'You will be redirected to PhonePe to pay with UPI, cards, wallets, or netbanking.',
  },
]

export default function PaymentOptions({ selectedPayment, onChange, codAvailable = false }) {
  return (
    <section className="space-y-md">
      <h2 className="font-serif text-xl md:text-headline-md text-primary flex items-center gap-base border-b border-outline-variant pb-base">
        <span className="material-symbols-outlined">account_balance_wallet</span>
        Payment
      </h2>

      <div className="space-y-sm">
        {PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-4 md:gap-md p-4 md:p-md rounded-xl cursor-pointer border transition-colors ${
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
            <div className="flex-grow flex items-center justify-between gap-4">
              <span>
                <span className="block text-label-md font-semibold text-primary">{option.title}</span>
                <span className="block text-label-sm text-on-surface-variant mt-1">{option.description}</span>
              </span>
              <span className="material-symbols-outlined text-on-surface-variant">{option.icon}</span>
            </div>
          </label>
        ))}
      </div>
      <p className="text-label-sm text-on-surface-variant">
        Payment security: <span className="font-semibold text-primary">online payments are completed on PhonePe's secure checkout.</span>
      </p>
    </section>
  )
}
