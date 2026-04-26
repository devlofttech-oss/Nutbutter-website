import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import CartItem from '../components/CartItem.jsx'
import CartSummary from '../components/CartSummary.jsx'
import { INITIAL_CART_ITEMS } from '../data/cartData.js'

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )
  const tax = Math.round((subtotal - discount) * 0.05)
  const total = Math.max(subtotal - discount + tax, 0)

  const updateQuantity = (id, direction) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + direction) }
          : item,
      ),
    )
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyCoupon = () => {
    const normalizedCoupon = coupon.trim().toLowerCase()
    setDiscount(normalizedCoupon === 'slowcraft' ? Math.round(subtotal * 0.1) : 0)
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header cartCount={itemCount} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
        <section className="mb-lg">
          <nav className="flex items-center gap-2 mb-sm text-xs text-secondary uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold font-serif">Cart</span>
          </nav>
          <h1 className="font-serif text-headline-xl text-primary-container mb-sm">Your Cart</h1>
          <p className="font-serif text-body-lg text-on-surface-variant max-w-2xl">
            Review your selection of artisanal nut butters, stone-ground for purity and slow-crafted for depth of flavor.
          </p>
        </section>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            <section className="lg:col-span-8 space-y-md">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={(id) => updateQuantity(id, 1)}
                  onDecrease={(id) => updateQuantity(id, -1)}
                  onRemove={removeItem}
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
        ) : (
          <EmptyCart />
        )}
      </main>

      <Footer />
    </div>
  )
}

function ContinueShopping() {
  return (
    <Link
      className="inline-flex items-center gap-3 text-label-md font-semibold text-secondary hover:text-primary-container transition-all pt-4"
      to="/shop"
    >
      <span className="material-symbols-outlined text-lg">arrow_back</span>
      <span className="border-b border-transparent hover:border-secondary">Continue Shopping</span>
    </Link>
  )
}

function EmptyCart() {
  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-xl text-center">
      <span className="material-symbols-outlined text-5xl text-secondary mb-md">shopping_bag</span>
      <h2 className="font-serif text-headline-lg text-primary mb-sm">Your cart is empty</h2>
      <p className="text-body-md text-on-surface-variant max-w-lg mx-auto mb-md">
        Add a small-batch spread to begin building your next pantry ritual.
      </p>
      <Link to="/shop">
        <button className="bg-primary-container text-on-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-95">
          Continue Shopping
        </button>
      </Link>
    </section>
  )
}
