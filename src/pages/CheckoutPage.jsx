import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import DeliveryOptions from '../components/DeliveryOptions.jsx'
import PaymentOptions from '../components/PaymentOptions.jsx'
import CheckoutSummary from '../components/CheckoutSummary.jsx'
import { CHECKOUT_ITEMS, CUSTOMER_FIELDS, DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../data/checkoutData.js'

const initialFormValues = CUSTOMER_FIELDS.reduce((values, field) => {
  values[field.name] = ''
  return values
}, {})

export default function CheckoutPage() {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0].id)
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_OPTIONS[0].id)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = useMemo(
    () => CHECKOUT_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [],
  )
  const shipping = DELIVERY_OPTIONS.find((option) => option.id === selectedDelivery)?.price ?? 0
  const total = subtotal + shipping
  const cartCount = CHECKOUT_ITEMS.reduce((sum, item) => sum + item.quantity, 0)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setOrderPlaced(true)
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header cartCount={cartCount} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
        <section className="mb-lg">
          <nav className="flex items-center gap-2 mb-sm text-xs text-secondary uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <Link className="hover:text-primary transition-colors font-serif" to="/cart">Cart</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold font-serif">Checkout</span>
          </nav>
          <h1 className="font-serif text-headline-xl text-primary mb-sm">Checkout</h1>
          <p className="font-serif text-body-lg text-on-surface-variant max-w-2xl italic">
            Finalize your order of our handcrafted, stone-ground provisions. Each jar is prepared with care and tradition.
          </p>
        </section>

        <form className="flex flex-col lg:flex-row gap-lg items-start" onSubmit={handleSubmit}>
          <div className="flex-grow w-full space-y-lg">
            <CheckoutForm values={formValues} onChange={handleInputChange} />
            <DeliveryOptions selectedDelivery={selectedDelivery} onChange={setSelectedDelivery} />
            <PaymentOptions selectedPayment={selectedPayment} onChange={setSelectedPayment} />
          </div>

          <CheckoutSummary
            items={CHECKOUT_ITEMS}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            orderPlaced={orderPlaced}
            onPlaceOrder={handleSubmit}
          />
        </form>
      </main>

      <Footer />
    </div>
  )
}
