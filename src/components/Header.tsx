import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/constants.js'

export default function Header({ cartCount = 0 }) {
  const { pathname } = useLocation()

  return (
    <header className="bg-[#F5EFE6] border-b border-[#E6D5B8] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-12 h-20 flex justify-between items-center w-full">
        <Link to="/" className="text-2xl font-serif font-bold text-[#4B3621]">
          Artisan Nut Co.
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`font-serif text-lg tracking-tight transition-colors duration-300 ${
                  isActive
                    ? 'text-[#4B3621] font-bold border-b-2 border-[#4B3621] pb-1'
                    : 'text-stone-600 hover:text-[#A67B5B]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative" aria-label="View cart">
            <button className="material-symbols-outlined text-[#4B3621] active:scale-95 transition-transform">
              shopping_bag
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/checkout">
            <button className="material-symbols-outlined text-[#4B3621] active:scale-95 transition-transform">
              person
            </button>
          </Link>
          <button className="md:hidden material-symbols-outlined text-[#4B3621]">menu</button>
        </div>
      </div>
    </header>
  )
}
