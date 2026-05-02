import { Link } from 'react-router-dom'
import { PAYMENT_METHODS } from '../data/cartData.js'

export default function CartSummary({ subtotal, discount, tax, total, coupon, onCouponChange, onApplyCoupon }) {
  return (
    <aside className="lg:col-span-4 space-y-6">
      <section className="p-4 md:p-6 bg-surface-container-high/60 rounded-xl border border-outline-variant shadow-[0_14px_35px_rgba(115,91,66,0.05)]">
        <label
          className="block text-xs uppercase tracking-[0.16em] text-primary-container/80 mb-3 font-bold"
          htmlFor="discount-code"
        >
          Discount Code
        </label>
        <div className="flex flex-col min-[380px]:flex-row overflow-hidden rounded-lg border border-outline-variant bg-white">
          <input
            id="discount-code"
            className="flex-grow min-w-0 border-none px-4 py-3 text-sm text-primary-container focus:outline-none focus:ring-1 focus:ring-secondary placeholder:text-on-surface-variant/40"
            placeholder="Enter code"
            type="text"
            value={coupon}
            onChange={(event) => onCouponChange(event.target.value)}
          />
          <button
            className="bg-primary-container text-on-primary px-5 py-3 text-sm font-bold hover:bg-primary transition-colors uppercase tracking-[0.12em]"
            type="button"
            onClick={onApplyCoupon}
          >
            Apply
          </button>
        </div>
      </section>

      <section className="p-5 md:p-7 bg-surface-container-high rounded-xl border border-outline-variant space-y-7 shadow-[0_24px_55px_rgba(115,91,66,0.08)]">
        <h2 className="font-serif text-3xl text-primary-container">Order Summary</h2>

        <div className="space-y-4 pt-4">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          {discount > 0 && <SummaryRow label="Discount" value={`-${formatCurrency(discount)}`} />}
          <div className="flex justify-between gap-4 text-sm text-on-surface-variant">
            <span>Shipping</span>
            <span className="text-right text-xs uppercase tracking-[0.08em] self-center italic">Calculated at checkout</span>
          </div>
          <SummaryRow label="Estimated Tax" value={formatCurrency(tax)} className="border-b border-outline-variant pb-4" />
          <div className="flex justify-between items-baseline pt-4 gap-4">
            <span className="font-serif text-2xl text-primary-container">Total</span>
            <span className="font-serif text-3xl md:text-4xl text-primary-container">{formatCurrency(total)}</span>
          </div>
        </div>

        <Link to="/checkout">
          <button className="w-full bg-primary-container text-on-primary py-4 rounded-lg text-sm font-bold uppercase tracking-[0.14em] hover:shadow-2xl hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3">
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
    <div className={`flex justify-between gap-4 text-sm text-on-surface-variant ${className}`}>
      <span>{label}</span>
      <span className="font-bold text-primary-container">{value}</span>
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
