import { Link } from 'react-router-dom'
import { PAYMENT_METHODS } from '../data/cartData.js'

export default function CartSummary({ subtotal, discount, tax, total, coupon, onCouponChange, onApplyCoupon }) {
  return (
    <aside className="lg:col-span-4 space-y-8">
      <section className="p-8 bg-surface-container-high/50 rounded-xl border border-outline-variant">
        <label
          className="block text-xs uppercase tracking-widest text-primary-container/80 mb-4 font-semibold"
          htmlFor="discount-code"
        >
          Discount Code
        </label>
        <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-white">
          <input
            id="discount-code"
            className="flex-grow min-w-0 border-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/40"
            placeholder="Enter code"
            type="text"
            value={coupon}
            onChange={(event) => onCouponChange(event.target.value)}
          />
          <button
            className="bg-primary-container text-on-primary px-6 py-3 text-sm font-semibold hover:bg-primary transition-colors uppercase tracking-wider"
            type="button"
            onClick={onApplyCoupon}
          >
            Apply
          </button>
        </div>
      </section>

      <section className="p-8 bg-surface-container-high rounded-xl border border-outline-variant space-y-8">
        <h2 className="font-serif text-headline-lg text-primary-container">Order Summary</h2>

        <div className="space-y-4 pt-4">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          {discount > 0 && <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} />}
          <div className="flex justify-between text-on-surface-variant">
            <span>Shipping</span>
            <span className="text-xs uppercase tracking-tight self-center italic">Calculated at checkout</span>
          </div>
          <SummaryRow label="Estimated Tax" value={formatCurrency(tax)} className="border-b border-outline-variant pb-4" />
          <div className="flex justify-between items-baseline pt-4 gap-md">
            <span className="font-serif text-headline-md text-primary-container">Total</span>
            <span className="font-serif text-headline-xl text-primary-container">{formatCurrency(total)}</span>
          </div>
        </div>

        <Link to="/checkout">
          <button className="w-full bg-primary-container text-on-primary py-5 rounded-xl font-serif text-headline-md hover:shadow-2xl hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3">
            Proceed to Checkout
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </Link>

        <div className="flex justify-center items-center gap-6 pt-2">
          {PAYMENT_METHODS.map((method) => (
            <img
              key={method.label}
              className="h-5 grayscale opacity-40 hover:opacity-100 transition-opacity"
              src={method.image}
              alt={method.label}
            />
          ))}
        </div>
      </section>
    </aside>
  )
}

function SummaryRow({ label, value, className = '' }) {
  return (
    <div className={`flex justify-between text-on-surface-variant ${className}`}>
      <span>{label}</span>
      <span className="font-medium text-primary-container">{value}</span>
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
