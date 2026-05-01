import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import { fetchMyOrders } from '../api/orderApi.js'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    fetchMyOrders()
      .then((data) => {
        if (!isMounted) return
        setOrders(data)
        setError('')
      })
      .catch((fetchError) => {
        if (!isMounted) return
        setOrders([])
        setError(fetchError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
        <section className="mb-lg">
          <nav className="flex items-center gap-2 mb-sm text-xs text-secondary uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold font-serif">Orders</span>
          </nav>
          <h1 className="font-serif text-headline-xl text-primary mb-sm">My Orders</h1>
          <p className="font-serif text-body-lg text-on-surface-variant max-w-2xl italic">
            Track your handcrafted provisions and revisit past pantry rituals.
          </p>
        </section>

        {isLoading && <OrdersState message="Loading your orders..." />}
        {!isLoading && error && <OrdersState message="Orders could not be loaded right now." />}
        {!isLoading && !error && orders.length === 0 && <OrdersState message="No orders yet. Your first jar is waiting." />}
        {!isLoading && !error && orders.length > 0 && (
          <section className="space-y-md">
            {orders.map((order) => (
              <article key={order.id} className="bg-white/40 rounded-xl border border-outline-variant shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-outline-variant pb-5 mb-5">
                  <div>
                    <h2 className="font-serif text-headline-md text-primary-container">{order.order_number}</h2>
                    <p className="text-sm text-on-surface-variant mt-1">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{order.status.replaceAll('_', ' ')}</p>
                    <p className="font-serif text-headline-md text-primary-container mt-1">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
                <div className="space-y-sm">
                  {(order.order_items ?? []).map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-body-md text-on-surface-variant">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>{formatCurrency(item.line_total)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

function OrdersState({ message }) {
  return (
    <section className="bg-surface-container rounded-xl border border-outline-variant p-xl text-center text-on-surface-variant">
      {message}
    </section>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}
