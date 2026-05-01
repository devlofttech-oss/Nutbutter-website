import { useEffect, useState } from 'react'
import { fetchAdminStats } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchAdminStats().then(setStats)
  }, [])

  return (
    <AdminLayout title="Admin Dashboard">
      {!stats ? <PageLoader message="Loading dashboard..." /> : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <Metric label="Products" value={stats.productCount} />
          <Metric label="Orders" value={stats.orderCount} />
          <Metric label="Revenue" value={formatCurrency(stats.revenue)} />
          <Metric label="Open Messages" value={stats.openMessages} />
          <Metric label="Active Coupons" value={stats.activeCoupons} />
        </section>
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
