import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/constants.js'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'
import { useCart } from '../providers/CartProvider.jsx'

export default function Header({ cartCount }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { isAuthenticated, signOut } = useAuthSession()
  const displayedCartCount = cartCount ?? itemCount

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd2]/80 bg-white/85 shadow-[0_18px_45px_rgba(115,91,66,0.06)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-12 h-20 flex justify-between items-center w-full">
        <Link
          to="/"
          className="text-xl md:text-2xl font-serif font-bold tracking-[0.12em] uppercase text-[#4B3621]"
          onClick={() => setMenuOpen(false)}
        >
          Artisan Nut Co.
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
              || (link.href === '/shop' && pathname.startsWith('/shop'))
              || (link.href === '/blog' && pathname.startsWith('/blog'))
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  isActive
                    ? 'text-[#4B3621] border-b border-[#4B3621] pb-1'
                    : 'text-stone-500 hover:text-[#8C7355]'
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
            {displayedCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-container text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {displayedCartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <button
              className="material-symbols-outlined text-[#4B3621] active:scale-95 transition-transform"
              type="button"
              aria-label="Logout"
              onClick={() => signOut()}
            >
              logout
            </button>
          ) : (
            <Link to="/login" aria-label="Login">
              <button className="material-symbols-outlined text-[#4B3621] active:scale-95 transition-transform">
                person
              </button>
            </Link>
          )}
          <button
            className="lg:hidden material-symbols-outlined text-[#4B3621]"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="lg:hidden border-t border-[#E6D5B8] bg-white/95 px-6 py-5 space-y-2 shadow-[0_24px_40px_rgba(75,54,33,0.08)]">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href === '/shop' && pathname.startsWith('/shop'))
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`block rounded-lg px-4 py-3 font-serif text-base transition-colors ${
                  isActive ? 'bg-surface-container text-[#4B3621] font-bold' : 'text-stone-600 hover:bg-surface-container'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
