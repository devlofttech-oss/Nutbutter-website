import { useEffect, useState } from 'react'
import { fetchCoupons, saveCoupon } from '../../api/adminApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'
import { useToast } from '../../providers/ToastProvider.jsx'

const emptyCoupon = {
  code: '',
  description: '',
  discount_type: 'percent',
  discount_value: '',
  expires_at: '',
  usage_limit: '',
  is_active: true,
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(null)
  const [form, setForm] = useState(emptyCoupon)
  const { showToast } = useToast()

  const load = async () => setCoupons(await fetchCoupons())

  useEffect(() => {
    load()
  }, [])

  const save = async (event) => {
    event.preventDefault()

    try {
      await saveCoupon(form)
      setForm(emptyCoupon)
      await load()
      showToast('Coupon saved')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }))

  return (
    <AdminLayout title="Coupons">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form className="rounded-xl border border-outline-variant bg-surface-container-low p-6 space-y-4" onSubmit={save}>
          <h2 className="font-serif text-2xl text-primary">{form.id ? 'Edit Coupon' : 'Create Coupon'}</h2>
          <Input label="Code" value={form.code} onChange={(value) => update('code', value)} />
          <Input label="Description" value={form.description} onChange={(value) => update('description', value)} required={false} />
          <select className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3" value={form.discount_type} onChange={(event) => update('discount_type', event.target.value)}>
            <option value="percent">% Discount</option>
            <option value="flat">Flat Discount</option>
          </select>
          <Input label="Discount Value" type="number" value={form.discount_value} onChange={(value) => update('discount_value', value)} />
          <Input label="Expiry Date" type="date" value={form.expires_at} onChange={(value) => update('expires_at', value)} required={false} />
          <Input label="Usage Limit" type="number" value={form.usage_limit} onChange={(value) => update('usage_limit', value)} required={false} />
          <label className="flex items-center gap-3 text-sm font-semibold text-primary"><input type="checkbox" checked={form.is_active} onChange={(event) => update('is_active', event.target.checked)} /> Active</label>
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold" type="submit">Save Coupon</button>
        </form>
        <section className="lg:col-span-2">
          {!coupons ? <PageLoader message="Loading coupons..." /> : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <article key={coupon.id} className="rounded-xl border border-outline-variant bg-white/50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-primary">{coupon.code}</h3>
                    <p className="text-sm text-on-surface-variant">{coupon.discount_type} / {coupon.discount_value} / Used {coupon.used_count}{coupon.usage_limit ? ` of ${coupon.usage_limit}` : ''}</p>
                  </div>
                  <button className="text-primary font-semibold" type="button" onClick={() => setForm({ ...coupon, expires_at: coupon.expires_at?.slice(0, 10) ?? '' })}>Edit</button>
                </article>
              ))}
              {coupons.length === 0 && <div className="rounded-xl border border-outline-variant bg-surface-container-low p-10 text-center text-on-surface-variant">No coupons yet.</div>}
            </div>
          )}
        </section>
      </section>
    </AdminLayout>
  )
}

function Input({ label, value, onChange, type = 'text', required = true }) {
  return <input className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3" placeholder={label} required={required} type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
}
