import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateAdminOrderStatus } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'
import { useToast } from '../../providers/ToastProvider.jsx'

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  const load = async (term = search) => {
    setIsLoading(true)
    setOrders(await fetchAdminOrders(term))
    setIsLoading(false)
  }

  useEffect(() => {
    const id = window.setTimeout(() => load(search), 250)
    return () => window.clearTimeout(id)
  }, [search])

  const changeStatus = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status)
      await load()
      showToast('Order updated')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  return (
    <AdminLayout title="Orders">
      <input className="w-full md:w-96 rounded-lg border border-outline-variant bg-white px-4 py-3 mb-6" placeholder="Search orders or email" value={search} onChange={(event) => setSearch(event.target.value)} />
      {isLoading ? <PageLoader message="Loading orders..." /> : (
        <section className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-outline-variant bg-white/50 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-primary">{order.order_number}</h2>
                  <p className="text-sm text-on-surface-variant">{order.customer_email} / {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                  {order.shipments?.[0] && (
                    <p className="text-sm text-on-surface-variant mt-1">
                      {order.shipments[0].courier_name || order.shiprocket_courier_name || 'Shiprocket'} / {order.shipments[0].awb_code || order.shipments[0].status}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif text-xl text-primary">{formatCurrency(order.total_amount)}</span>
                  <select className="rounded-lg border border-outline-variant bg-white px-3 py-2" value={order.status} onChange={(event) => changeStatus(order.id, event.target.value)}>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
            </article>
          ))}
          {orders.length === 0 && <EmptyState message="No orders found." />}
        </section>
      )}
    </AdminLayout>
  )
}

function EmptyState({ message }) {
  return <div className="rounded-xl border border-outline-variant bg-surface-container-low p-10 text-center text-on-surface-variant">{message}</div>
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}
