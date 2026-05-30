import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import DeliveryOptions from '../components/DeliveryOptions.jsx'
import PaymentOptions from '../components/PaymentOptions.jsx'
import CheckoutSummary from '../components/CheckoutSummary.jsx'
import { CUSTOMER_FIELDS } from '../data/checkoutData.js'
import { createCheckoutSession, estimateShipping } from '../api/checkoutApi.js'
import { createPhonePePayment } from '../api/paymentApi.js'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'
import { useCart } from '../providers/CartProvider.jsx'

const initialFormValues = CUSTOMER_FIELDS.reduce((values, field) => {
  values[field.name] = ''
  return values
}, {})

function validateAddress(values) {
  return CUSTOMER_FIELDS.reduce((errors, field) => {
    if (!String(values[field.name] ?? '').trim()) {
      errors[field.name] = `${field.label} is required`
    }

    return errors
  }, {})
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuthSession()
  const { items: cartItems, subtotal, isLoading: isCartLoading } = useCart()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [billingValues, setBillingValues] = useState(initialFormValues)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [shippingQuote, setShippingQuote] = useState(null)
  const [selectedCourierId, setSelectedCourierId] = useState(null)
  const [isEstimatingShipping, setIsEstimatingShipping] = useState(false)
  const [shippingError, setShippingError] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('phonepe')
  const [errors, setErrors] = useState({})
  const [billingErrors, setBillingErrors] = useState({})
  const [checkoutError, setCheckoutError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return

    setFormValues((currentValues) => ({
      ...currentValues,
      fullName: currentValues.fullName || user.user_metadata?.full_name || user.user_metadata?.name || '',
      email: currentValues.email || user.email || '',
      phone: currentValues.phone || user.user_metadata?.phone || '',
    }))
  }, [user])

  useEffect(() => {
    const pincode = formValues.pincode.trim()

    setShippingError('')

    if (!isAuthenticated || pincode.length !== 6 || cartItems.length === 0) {
      setShippingQuote(null)
      setSelectedCourierId(null)
      return undefined
    }

    let isMounted = true
    const timeoutId = window.setTimeout(() => {
      setIsEstimatingShipping(true)
      estimateShipping(pincode)
        .then((quote) => {
          if (!isMounted) return
          setShippingQuote(quote)
          setSelectedCourierId((currentId) => (
            quote.couriers?.some((courier) => Number(courier.courierId) === Number(currentId))
              ? currentId
              : quote.recommendedCourier?.courierId ?? quote.couriers?.[0]?.courierId ?? null
          ))
        })
        .catch((error) => {
          if (!isMounted) return
          setShippingQuote(null)
          setSelectedCourierId(null)
          setShippingError(error.message)
        })
        .finally(() => {
          if (isMounted) setIsEstimatingShipping(false)
        })
    }, 450)

    return () => {
      isMounted = false
      window.clearTimeout(timeoutId)
    }
  }, [cartItems.length, formValues.pincode, isAuthenticated])

  const shipping = 0
  const discount = 0
  const tax = useMemo(() => Math.round((subtotal - discount) * 0.05), [discount, subtotal])
  const total = Math.max(subtotal - discount + shipping + tax, 0)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleBillingInputChange = (event) => {
    const { name, value } = event.target
    setBillingValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setCheckoutError('')

    if (!isAuthenticated) {
      setCheckoutError('Please sign in before placing your order.')
      return
    }

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.')
      return
    }

    const nextErrors = validateAddress(formValues)
    const nextBillingErrors = billingSameAsShipping ? {} : validateAddress(billingValues)
    setErrors(nextErrors)
    setBillingErrors(nextBillingErrors)

    if (Object.keys(nextErrors).length > 0 || Object.keys(nextBillingErrors).length > 0) {
      setCheckoutError('Please complete the required checkout fields.')
      return
    }

    if (!selectedCourierId) {
      setCheckoutError('Please enter a serviceable pincode and select a shipping method.')
      return
    }

    setIsSubmitting(true)

    try {
      const session = await createCheckoutSession({
        shippingAddress: formValues,
        billingSameAsShipping,
        billingAddress: billingSameAsShipping ? null : billingValues,
        selectedCourierId,
      })
      const payment = await createPhonePePayment(session.checkoutSessionId)

      setOrderPlaced(true)

      if (payment.redirectUrl) {
        window.location.assign(payment.redirectUrl)
        return
      }

      setCheckoutError('Payment could not be started. Please try again.')
    } catch (error) {
      setCheckoutError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-7 md:py-xl">
        <section className="mb-6 md:mb-lg">
          <nav className="flex items-center gap-2 mb-4 md:mb-sm text-[11px] md:text-xs text-secondary uppercase tracking-[0.12em] md:tracking-widest overflow-x-auto whitespace-nowrap pb-1">
            <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <Link className="hover:text-primary transition-colors font-serif" to="/cart">Cart</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold font-serif">Checkout</span>
          </nav>
          <h1 className="font-serif text-[32px] md:text-headline-xl leading-tight text-primary mb-3 md:mb-sm">Checkout</h1>
          <p className="font-serif text-[15px] md:text-body-lg leading-7 text-on-surface-variant max-w-2xl italic">
            Finalize your order of our handcrafted, stone-ground provisions. Each jar is prepared with care and tradition.
          </p>
        </section>

        {isCartLoading && <CheckoutState message="Loading your cart..." />}
        {!isCartLoading && cartItems.length === 0 && <CheckoutState message="Your cart is empty. Add a small-batch spread before checkout." />}
        {!isCartLoading && cartItems.length > 0 && (
          <form className="flex flex-col lg:flex-row gap-6 md:gap-lg items-start" onSubmit={handleSubmit}>
            <div className="flex-grow w-full space-y-6 md:space-y-lg">
              {!isAuthenticated && (
                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 md:p-md text-sm md:text-base text-on-surface-variant">
                  Please <Link className="text-primary font-semibold" to="/login">sign in</Link> to place your order and save it to your account.
                </div>
              )}
              <CheckoutForm values={formValues} errors={errors} title="Shipping Address" onChange={handleInputChange} />
              <label className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm md:text-label-md font-semibold text-primary-container">
                <input
                  checked={billingSameAsShipping}
                  className="mt-0.5 h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
                  type="checkbox"
                  onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                  style={{ accentColor: '#33210d' }}
                />
                Billing address is same as shipping
              </label>
              {!billingSameAsShipping && (
                <CheckoutForm values={billingValues} errors={billingErrors} title="Billing Address" onChange={handleBillingInputChange} />
              )}
              <DeliveryOptions
                codAvailable={Boolean(shippingQuote?.codAvailable)}
                couriers={shippingQuote?.couriers ?? []}
                error={shippingError}
                isLoading={isEstimatingShipping}
                pincode={formValues.pincode.trim()}
                selectedCourierId={selectedCourierId}
                onChange={setSelectedCourierId}
              />
              <PaymentOptions
                codAvailable={Boolean(shippingQuote?.codAvailable)}
                selectedPayment={selectedPayment}
                onChange={setSelectedPayment}
              />
            </div>

            <CheckoutSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
              selectedPaymentLabel={selectedPayment === 'phonepe' ? 'PhonePe Secure Checkout' : selectedPayment}
              orderPlaced={orderPlaced}
              isSubmitting={isSubmitting}
              isDisabled={!selectedCourierId || isEstimatingShipping}
              error={checkoutError}
              onPlaceOrder={handleSubmit}
            />
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}

function CheckoutState({ message }) {
  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-8 md:p-xl text-center text-on-surface-variant">
      {message}
    </section>
  )
}
