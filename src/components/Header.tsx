import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/constants.js'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'
import logo from '../../assets/logo.png'

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated } = useAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd2]/80 bg-white/85 shadow-[0_18px_45px_rgba(115,91,66,0.06)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 xl:px-12 h-[72px] md:h-[84px] flex justify-between items-center w-full">
        <Link
          to="/"
          className="flex min-w-0 items-center"
          onClick={() => setMenuOpen(false)}
          aria-label="Satvegik home"
        >
          <img className="h-[39px] w-auto md:h-[46px] object-contain drop-shadow-[0_8px_18px_rgba(75,54,33,0.13)]" src={logo} alt="Satvegik" />
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

        <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
          {isAuthenticated ? (
            <Link to="/account" aria-label="My account">
              <button
                className={`h-10 w-10 rounded-full border transition-all active:scale-95 ${
                  pathname.startsWith('/account') || pathname.startsWith('/orders')
                    ? 'border-[#4B3621] bg-[#4B3621] text-white shadow-[0_10px_24px_rgba(75,54,33,0.18)]'
                    : 'border-[#eadfd2] bg-white/70 text-[#4B3621] hover:border-[#8C7355]'
                } material-symbols-outlined text-[22px]`}
                type="button"
              >
                account_circle
              </button>
            </Link>
          ) : (
            <Link to="/login" aria-label="Login">
              <button className="h-10 w-10 rounded-full border border-[#eadfd2] bg-white/70 text-[#4B3621] active:scale-95 transition-all hover:border-[#8C7355] material-symbols-outlined text-[20px]" type="button">
                person
              </button>
            </Link>
          )}
          <button
            className="lg:hidden material-symbols-outlined text-[#4B3621] p-1 active:scale-95 transition-transform"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>
      <div className={`lg:hidden overflow-hidden border-t border-[#E6D5B8] bg-white/95 shadow-[0_24px_40px_rgba(75,54,33,0.08)] transition-all duration-300 ease-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="px-4 sm:px-6 py-4 space-y-2">
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
      </div>
    </header>
  )
}
