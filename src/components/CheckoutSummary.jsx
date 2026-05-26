import logo from '../../assets/logo.png'

export default function CheckoutSummary({ items, subtotal, shipping, tax = 0, discount = 0, total, onPlaceOrder, orderPlaced, isSubmitting = false, isDisabled = false, error = '', selectedPaymentLabel = 'PhonePe Secure Checkout' }) {
  return (
    <aside className="w-full lg:w-[400px] flex-shrink-0">
      <div className="lg:sticky lg:top-24 space-y-4 md:space-y-md p-5 md:p-lg bg-surface-container-low rounded-xl border border-outline-variant shadow-[0_16px_38px_rgba(115,91,66,0.05)]">
        <h2 className="font-serif text-[26px] md:text-headline-md text-primary border-b border-outline-variant pb-3 md:pb-base">
          Order Summary
        </h2>

        <div className="space-y-3 md:space-y-md py-2 md:py-md">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 md:gap-md">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
                <img className="w-full h-full object-cover grayscale-[0.3]" src={item.image} alt={item.name} />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-sm md:text-label-md font-semibold text-primary leading-5">{item.name}</h3>
                <p className="text-xs md:text-label-sm text-on-surface-variant">{item.variant}</p>
                <div className="flex justify-between gap-3 mt-1 md:mt-xs">
                  <p className="text-sm md:text-label-md font-semibold text-primary">{formatCurrency(item.price)}</p>
                  <p className="text-xs md:text-label-sm text-on-surface-variant">Qty {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 md:space-y-sm pt-4 md:pt-md border-t border-outline-variant">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SummaryRow label="Shipping" value={formatCurrency(shipping)} />
          <SummaryRow label="Payment Method" value={selectedPaymentLabel} />
          {discount > 0 && <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} />}
          <SummaryRow label="Estimated Tax" value={formatCurrency(tax)} />
          <div className="flex justify-between items-baseline font-serif text-[25px] md:text-headline-md text-primary pt-2 md:pt-sm gap-4">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          className="w-full bg-primary-container text-on-primary py-4 md:py-md rounded-lg text-xs md:text-label-md font-semibold uppercase tracking-[0.14em] md:tracking-widest hover:opacity-90 active:scale-[0.98] transition-all mt-5 md:mt-lg"
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? 'Redirecting to PhonePe...' : isDisabled ? 'Select Shipping' : 'Pay Securely'}
        </button>

        {error && (
          <p className="text-center text-xs md:text-label-sm leading-5 text-error font-semibold">
            {error}
          </p>
        )}
        {orderPlaced && (
          <p className="text-center text-xs md:text-label-sm leading-5 text-secondary font-semibold">
            Order details captured. Continue in PhonePe to complete payment.
          </p>
        )}
        <div className="flex items-center justify-center gap-2 text-xs md:text-label-sm text-on-surface-variant italic">
          <span>Secure checkout by Satvegik</span>
          <img className="h-[33px] w-auto object-contain opacity-85" src={logo} alt="Satvegik" />
        </div>
      </div>
    </aside>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm md:text-body-md text-on-surface-variant">
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
