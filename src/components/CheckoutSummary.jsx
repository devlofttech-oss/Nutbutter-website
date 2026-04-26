export default function CheckoutSummary({ items, subtotal, shipping, total, onPlaceOrder, orderPlaced }) {
  return (
    <aside className="lg:w-[400px] flex-shrink-0">
      <div className="sticky top-24 space-y-md p-lg bg-surface-container-low rounded-xl border border-outline-variant">
        <h2 className="font-serif text-headline-md text-primary border-b border-outline-variant pb-base">
          Order Summary
        </h2>

        <div className="space-y-md py-md">
          {items.map((item) => (
            <div key={item.id} className="flex gap-md">
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
          <div className="flex justify-between font-serif text-headline-md text-primary pt-sm">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          className="w-full bg-primary-container text-on-primary py-md rounded-lg text-label-md font-semibold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all mt-lg"
          type="button"
          onClick={onPlaceOrder}
        >
          Place Order
        </button>

        {orderPlaced && (
          <p className="text-center text-label-sm text-secondary font-semibold">
            Order details captured. We will confirm shortly.
          </p>
        )}
        <p className="text-center text-label-sm text-on-surface-variant italic">
          Secure checkout powered by Artisan Nut Co.
        </p>
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
