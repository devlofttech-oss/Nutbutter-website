import { useEffect, useState } from 'react'
import { fetchAdminCustomers } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(null)

  useEffect(() => {
    fetchAdminCustomers().then(setCustomers)
  }, [])

  return (
    <AdminLayout title="Customers">
      {!customers ? <PageLoader message="Loading customers..." /> : (
        <section className="overflow-x-auto rounded-xl border border-outline-variant bg-white/50">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-[0.18em] text-secondary border-b border-outline-variant">
              <tr><th className="p-4">Customer</th><th className="p-4">Phone</th><th className="p-4">Orders</th><th className="p-4">Spend</th></tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-outline-variant/50">
                  <td className="p-4 font-semibold text-primary">{customer.full_name ?? 'Customer'}</td>
                  <td className="p-4 text-on-surface-variant">{customer.phone ?? '-'}</td>
                  <td className="p-4 text-on-surface-variant">{customer.orderCount}</td>
                  <td className="p-4 text-on-surface-variant">{formatCurrency(customer.spendTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </AdminLayout>
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}

