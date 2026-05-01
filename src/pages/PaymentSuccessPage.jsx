import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import { verifyPhonePePayment } from '../api/paymentApi.js'
import { fetchOrderById } from '../api/orderApi.js'
import { useCart } from '../providers/CartProvider.jsx'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const { clearCart, refreshCart } = useCart()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your payment...')
  const [order, setOrder] = useState(null)
  const orderId = searchParams.get('order_id')
  const merchantOrderId = searchParams.get('merchant_order_id')

  useEffect(() => {
    let isMounted = true

    async function verifyPayment() {
      if (!orderId || !merchantOrderId) {
        setStatus('failed')
        setMessage('Payment verification details are missing.')
        return
      }

      try {
        const result = await verifyPhonePePayment(orderId, merchantOrderId)
        const orderData = await fetchOrderById(orderId)

        if (!isMounted) return

        setOrder(orderData)

        if (result.success) {
          await clearCart()
          await refreshCart()
          setStatus('success')
          setMessage('Payment successful. Your order is confirmed.')
          return
        }

        setStatus('failed')
        setMessage('Payment was not completed. Please try again from checkout.')
      } catch (error) {
        if (!isMounted) return
        setStatus('failed')
        setMessage(error.message)
      }
    }

    verifyPayment()

    return () => {
      isMounted = false
    }
  }, [clearCart, merchantOrderId, orderId, refreshCart])

  return (
    <PaymentResultShell
      icon={status === 'success' ? 'check_circle' : status === 'verifying' ? 'hourglass_top' : 'error'}
      title={status === 'success' ? 'Order Confirmed' : status === 'verifying' ? 'Verifying Payment' : 'Payment Needs Attention'}
      message={message}
      order={order}
    />
  )
}

export function PaymentResultShell({ icon, title, message, order }) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
        <section className="max-w-2xl mx-auto bg-surface-container-low p-10 lg:p-12 rounded-[28px] shadow-[0_20px_50px_rgba(140,115,85,0.08)] border border-surface-container-highest/30 text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          <h1 className="font-serif text-[44px] md:text-[56px] leading-tight text-primary mb-4">{title}</h1>
          <p className="text-secondary leading-7 mb-8">{message}</p>
          {order && (
            <div className="rounded-xl border border-outline-variant bg-surface p-md mb-8 text-left">
              <div className="flex justify-between gap-4 text-body-md text-on-surface-variant">
                <span>Order ID</span>
                <span className="font-semibold text-primary">{order.order_number}</span>
              </div>
              <div className="flex justify-between gap-4 text-body-md text-on-surface-variant mt-sm">
                <span>Total</span>
                <span className="font-semibold text-primary">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link className="bg-primary text-on-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary-container transition-all" to="/orders">
              My Orders
            </Link>
            <Link className="border border-primary text-primary px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary hover:text-on-primary transition-all" to="/shop">
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

