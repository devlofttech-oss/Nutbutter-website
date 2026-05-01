import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../providers/CartProvider.jsx'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const productPath = `/product/${product.slug ?? product.id}`
  const price = product.priceLabel ?? formatCurrency(product.price)

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      await addToCart(product, 1, '250g')
      navigate('/cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="product-card group bg-white rounded-[28px] border border-[#eadfd2] flex flex-col overflow-hidden shadow-[0_18px_45px_rgba(115,91,66,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(115,91,66,0.13)]">
      <div
        className="relative bg-[#f2e8df] overflow-hidden cursor-pointer flex items-center justify-center"
        style={{ aspectRatio: '1/1' }}
        onClick={() => navigate(productPath)}
      >
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest z-10 ${
              product.badgeStyle ?? 'bg-black/20 backdrop-blur-md text-white'
            }`}
          >
            {product.badge}
          </span>
        )}
        <div className="absolute inset-8 rounded-full bg-white/35 blur-2xl" />
        <img
          src={product.image}
          alt={product.name}
          className="relative z-10 w-[82%] h-[82%] object-cover rounded-[22px] shadow-[0_20px_50px_rgba(75,54,33,0.16)] transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-6 flex flex-col" style={{ flex: 1 }}>
        <p className="text-[11px] text-secondary uppercase font-bold mb-2 tracking-[0.2em]">
          {product.category}
        </p>
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-serif text-2xl font-semibold text-primary leading-tight">{product.name}</h3>
          <span className="font-serif text-xl font-semibold text-primary whitespace-nowrap">{price}</span>
        </div>
        <div className="flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="text-xs text-on-surface-variant">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 leading-6" style={{ flex: 1 }}>
          {product.description}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-[#3b2a18] text-white rounded-full text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#8C7355] transition-colors"
          style={{ marginTop: 'auto' }}
          disabled={isAdding}
        >
          <span className="material-symbols-outlined text-base">shopping_cart</span>
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

function formatCurrency(value) {
  if (typeof value === 'string' && value.includes('₹')) return value

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}
