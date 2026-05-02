import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import CartItem from '../components/CartItem.jsx'
import CartSummary from '../components/CartSummary.jsx'
import { useCart } from '../providers/CartProvider.jsx'

export default function CartPage() {
  const { items: cartItems, isLoading, error, subtotal, itemCount, setItemQuantity, removeFromCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const tax = Math.round((subtotal - discount) * 0.05)
  const total = Math.max(subtotal - discount + tax, 0)

  const applyCoupon = () => {
    const normalizedCoupon = coupon.trim().toLowerCase()
    setDiscount(normalizedCoupon === 'slowcraft' ? Math.round(subtotal * 0.1) : 0)
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header cartCount={itemCount} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-10 md:py-20">
        <section className="mb-8 md:mb-12">
          <nav className="flex items-center gap-2 mb-5 text-[11px] md:text-xs text-secondary uppercase tracking-[0.12em] md:tracking-[0.16em]">
            <Link className="hover:text-primary transition-colors font-semibold" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold">Cart</span>
          </nav>
          <h1 className="font-serif text-[34px] md:text-[58px] leading-tight text-primary-container mb-4">Your Cart</h1>
          <p className="text-base md:text-lg leading-7 md:leading-8 text-on-surface-variant max-w-2xl">
            Review your selection of artisanal nut butters, stone-ground for purity and slow-crafted for depth of flavor.
          </p>
        </section>

        {isLoading && <CartState message="Loading your cart..." />}
        {!isLoading && error && <CartState message="Your cart could not be loaded right now." />}
        {!isLoading && !error && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-8 space-y-5">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={(id) => setItemQuantity(id, item.quantity + 1)}
                  onDecrease={(id) => setItemQuantity(id, item.quantity - 1)}
                  onRemove={removeFromCart}
                />
              ))}

              <ContinueShopping />
            </section>

            <CartSummary
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              total={total}
              coupon={coupon}
              onCouponChange={setCoupon}
              onApplyCoupon={applyCoupon}
            />
          </div>
        ) : null}
        {!isLoading && !error && cartItems.length === 0 && (
          <EmptyCart />
        )}
      </main>

      <Footer />
    </div>
  )
}

function CartState({ message }) {
  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-6 md:p-10 text-center text-base text-on-surface-variant">
      {message}
    </section>
  )
}

function ContinueShopping() {
  return (
    <Link
      className="inline-flex items-center gap-3 pt-4 text-xs md:text-sm font-bold uppercase tracking-[0.12em] md:tracking-[0.14em] text-secondary hover:text-primary-container transition-all"
      to="/shop"
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
      <span className="border-b border-transparent hover:border-secondary">Continue Shopping</span>
    </Link>
  )
}

function EmptyCart() {
  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-6 md:p-16 text-center shadow-[0_18px_45px_rgba(115,91,66,0.06)]">
      <span className="material-symbols-outlined text-5xl text-secondary mb-5">shopping_bag</span>
      <h2 className="font-serif text-3xl text-primary mb-3">Your cart is empty</h2>
      <p className="text-base leading-7 text-on-surface-variant max-w-lg mx-auto mb-6">
        Add a small-batch spread to begin building your next pantry ritual.
      </p>
      <Link to="/shop">
        <button className="bg-primary-container text-on-primary px-6 md:px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-[0.12em] md:tracking-[0.14em] transition-all hover:opacity-90 active:scale-95">
          Continue Shopping
        </button>
      </Link>
    </section>
  )
}
