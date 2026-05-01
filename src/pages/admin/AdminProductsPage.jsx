import { useEffect, useState } from 'react'
import { deleteAdminProduct, fetchAdminProducts, saveAdminProduct, uploadProductImage } from '../../api/adminApi.js'
import { fetchCategories } from '../../api/productApi.js'
import AdminLayout from '../../components/AdminLayout.jsx'
import PageLoader from '../../components/PageLoader.jsx'
import { useToast } from '../../providers/ToastProvider.jsx'

const emptyProduct = {
  name: '',
  slug: '',
  sku: '',
  category_id: '',
  price: '',
  stock_quantity: 0,
  description: '',
  image_url: '',
  badge: '',
  is_featured: false,
  is_active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { showToast } = useToast()

  const load = async () => {
    setIsLoading(true)
    const [productData, categoryData] = await Promise.all([fetchAdminProducts(), fetchCategories()])
    setProducts(productData)
    setCategories(categoryData)
    setIsLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      await saveAdminProduct(form)
      setForm(emptyProduct)
      await load()
      showToast('Product saved')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const url = await uploadProductImage(file)
      updateField('image_url', url)
      showToast('Image uploaded')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  return (
    <AdminLayout title="Products">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form className="lg:col-span-1 rounded-xl border border-outline-variant bg-surface-container-low p-6 space-y-4" onSubmit={handleSave}>
          <h2 className="font-serif text-2xl text-primary">{form.id ? 'Edit Product' : 'Add Product'}</h2>
          <AdminInput label="Name" value={form.name} onChange={(value) => updateField('name', value)} />
          <AdminInput label="Slug" value={form.slug} onChange={(value) => updateField('slug', value)} />
          <AdminInput label="SKU" value={form.sku} onChange={(value) => updateField('sku', value)} />
          <select className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3" value={form.category_id} onChange={(event) => updateField('category_id', event.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <AdminInput label="Price" type="number" value={form.price} onChange={(value) => updateField('price', value)} />
          <AdminInput label="Stock" type="number" value={form.stock_quantity} onChange={(value) => updateField('stock_quantity', value)} />
          <AdminInput label="Badge" value={form.badge ?? ''} onChange={(value) => updateField('badge', value)} />
          <textarea className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3" placeholder="Description" rows="4" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          <input className="w-full text-sm" type="file" accept="image/*" onChange={handleImageUpload} />
          <AdminInput label="Image URL" value={form.image_url} onChange={(value) => updateField('image_url', value)} />
          <label className="flex items-center gap-3 text-sm font-semibold text-primary"><input type="checkbox" checked={form.is_featured} onChange={(event) => updateField('is_featured', event.target.checked)} /> Featured</label>
          <label className="flex items-center gap-3 text-sm font-semibold text-primary"><input type="checkbox" checked={form.is_active} onChange={(event) => updateField('is_active', event.target.checked)} /> Active</label>
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold disabled:opacity-60" disabled={isSaving} type="submit">{isSaving ? 'Saving...' : 'Save Product'}</button>
        </form>

        <section className="lg:col-span-2">
          {isLoading ? <PageLoader message="Loading products..." /> : (
            <div className="space-y-4">
              {products.map((product) => (
                <article key={product.id} className="rounded-xl border border-outline-variant bg-white/50 p-5 flex flex-col md:flex-row gap-5 md:items-center">
                  <img className="h-20 w-20 rounded-lg object-cover bg-surface-container" src={product.image_url} alt={product.name} />
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl text-primary">{product.name}</h3>
                    <p className="text-sm text-on-surface-variant">{product.sku} / Stock {product.stock_quantity} / {formatCurrency(product.price)}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary mt-1">{product.is_active ? 'Active' : 'Inactive'} {product.is_featured ? '/ Featured' : ''}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-primary font-semibold" type="button" onClick={() => setForm(product)}>Edit</button>
                    <button className="text-error font-semibold" type="button" onClick={async () => { await deleteAdminProduct(product.id); await load(); showToast('Product deleted') }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </AdminLayout>
  )
}

function AdminInput({ label, value, onChange, type = 'text' }) {
  return <input className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3" placeholder={label} required type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}
