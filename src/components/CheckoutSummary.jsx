import logo from '../../assets/logo.png'

export default function CheckoutSummary({ items, subtotal, shipping, tax = 0, discount = 0, total, onPlaceOrder, orderPlaced, isSubmitting = false, isDisabled = false, error = '' }) {
  return (
    <aside className="w-full lg:w-[400px] flex-shrink-0">
      <div className="lg:sticky lg:top-24 space-y-md p-5 md:p-lg bg-surface-container-low rounded-xl border border-outline-variant">
        <h2 className="font-serif text-xl md:text-headline-md text-primary border-b border-outline-variant pb-base">
          Order Summary
        </h2>

        <div className="space-y-md py-md">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-md">
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
                <img className="w-full h-full object-cover grayscale-[0.3]" src={item.image} alt={item.name} />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-label-md font-semibold text-primary">{item.name}</h3>
                <p className="text-label-sm text-on-surface-variant">{item.variant}</p>
                <div className="flex justify-between gap-sm mt-xs">
                  <p className="text-label-md font-semibold text-primary">{formatCurrency(item.price)}</p>
                  <p className="text-label-sm text-on-surface-variant">Qty {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-sm pt-md border-t border-outline-variant">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SummaryRow label="Shipping" value={formatCurrency(shipping)} />
          {discount > 0 && <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} />}
          <SummaryRow label="Estimated Tax" value={formatCurrency(tax)} />
          <div className="flex justify-between font-serif text-xl md:text-headline-md text-primary pt-sm gap-4">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          className="w-full bg-primary-container text-on-primary py-md rounded-lg text-label-md font-semibold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all mt-lg"
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? 'Redirecting...' : isDisabled ? 'Select Shipping' : 'Place Order'}
        </button>

        {error && (
          <p className="text-center text-label-sm text-error font-semibold">
            {error}
          </p>
        )}
        {orderPlaced && (
          <p className="text-center text-label-sm text-secondary font-semibold">
            Order details captured. We will confirm shortly.
          </p>
        )}
        <div className="flex items-center justify-center gap-2 text-label-sm text-on-surface-variant italic">
          <span>Secure checkout powered by</span>
          <img className="h-7 w-auto object-contain opacity-85" src={logo} alt="Satvegik" />
        </div>
      </div>
    </aside>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-body-md text-on-surface-variant">
      <span>{label}</span>
      <span>{value}</span>
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
