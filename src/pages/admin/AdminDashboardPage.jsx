import { useEffect, useState } from 'react'
import { fetchAdminStats } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'
import OrderTimeline from '../../components/OrderTimeline.jsx'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchAdminStats().then(setStats)
  }, [])

  return (
    <AdminLayout title="Admin Dashboard">
      {!stats ? <PageLoader message="Loading dashboard..." /> : (
        <div className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <Metric label="Products" value={stats.productCount} />
            <Metric label="Orders" value={stats.orderCount} />
            <Metric label="Revenue" value={formatCurrency(stats.revenue)} />
            <Metric label="Open Messages" value={stats.openMessages} />
            <Metric label="Active Coupons" value={stats.activeCoupons} />
          </section>
          <section>
            <h2 className="font-serif text-2xl text-primary mb-4">Recent Order Timelines</h2>
            <div className="space-y-4">
              {(stats.recentOrders ?? []).map((order) => (
                <article key={order.id} className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <h3 className="font-serif text-xl text-primary">{order.order_number}</h3>
                    <p className="text-sm text-on-surface-variant">{order.status.replaceAll('_', ' ')}</p>
                  </div>
                  <OrderTimeline compact events={order.order_timeline_events ?? []} />
                </article>
              ))}
              {(stats.recentOrders ?? []).length === 0 && (
                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-10 text-center text-on-surface-variant">No orders yet.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary font-bold">{label}</p>
      <p className="font-serif text-3xl text-primary mt-3">{value}</p>
    </div>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}
