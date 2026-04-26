import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from '../data/constants.js'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#E6D5B8] bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="text-xl font-serif font-bold text-[#4B3621] mb-4">Artisan Nut Co.</div>
            <p className="text-sm text-stone-500 font-serif">
              Stone-ground nut butters crafted with love and no compromises.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#4B3621] font-serif font-bold hover:text-[#A67B5B] transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Chat on WhatsApp
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h5 className="font-serif font-bold text-[#4B3621] uppercase tracking-widest text-sm mb-4">
                {section}
              </h5>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-serif text-sm text-stone-500 hover:text-[#A67B5B] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E6D5B8] pt-8 text-center">
          <p className="text-[#4B3621] font-serif text-sm uppercase tracking-widest opacity-80">
            © 2024 Artisan Nut Co. Crafted for the slow pace.
          </p>
        </div>
      </div>
    </footer>
  )
}
