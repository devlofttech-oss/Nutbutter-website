import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'

const adminLinks = [
  ['Dashboard', '/admin'],
  ['Products', '/admin/products'],
  ['Orders', '/admin/orders'],
  ['Customers', '/admin/customers'],
  ['Messages', '/admin/messages'],
  ['Coupons', '/admin/coupons'],
]

export default function AdminLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-outline-variant bg-white/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-[84px] flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-3">
          <Link className="inline-flex items-center self-center md:self-auto" to="/" aria-label="Satvegik home">
            <img className="h-[65px] w-auto object-contain drop-shadow-[0_8px_18px_rgba(75,54,33,0.12)]" src={logo} alt="Satvegik" />
          </Link>
          <nav className="flex gap-4 overflow-x-auto text-xs font-bold uppercase tracking-[0.14em]">
            {adminLinks.map(([label, href]) => (
              <NavLink key={href} className={({ isActive }) => isActive ? 'text-primary border-b border-primary pb-1 whitespace-nowrap' : 'text-secondary hover:text-primary whitespace-nowrap'} end={href === '/admin'} to={href}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-serif text-[42px] text-primary mb-8">{title}</h1>
        {children}
      </main>
    </div>
  )
}
