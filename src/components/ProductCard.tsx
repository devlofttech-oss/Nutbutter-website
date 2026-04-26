import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div className="product-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col overflow-hidden">
      {/* Image */}
      <div
        className="relative bg-surface-container-low overflow-hidden cursor-pointer"
        style={{ aspectRatio: '4/5' }}
        onClick={() => navigate('/product')}
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
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-gutter flex flex-col" style={{ flex: 1 }}>
        <p className="text-xs text-secondary uppercase font-semibold mb-1 tracking-wider">
          {product.category}
        </p>
        <div className="flex justify-between items-start mb-xs">
          <h3 className="font-serif text-2xl font-semibold text-primary">{product.name}</h3>
          <span className="font-serif text-2xl font-semibold text-primary">{product.price}</span>
        </div>
        <div className="flex items-center gap-1 mb-base">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="text-xs text-on-surface-variant">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        <p className="text-base text-on-surface-variant mb-md text-sm" style={{ flex: 1 }}>
          {product.description}
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="w-full py-3 bg-[#2D3333] text-white rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-black transition-colors"
          style={{ marginTop: 'auto' }}
        >
          <span className="material-symbols-outlined text-base">shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
