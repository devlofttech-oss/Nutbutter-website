import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from '../data/constants.js'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#eadfd2] bg-[#f4e9dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9 md:gap-12 mb-12 md:mb-14">
          <div className="md:pr-8">
            <div className="mb-5">
              <img className="h-[109px] w-auto object-contain drop-shadow-[0_8px_18px_rgba(75,54,33,0.12)]" src={logo} alt="Satvegik" />
            </div>
            <p className="text-sm text-stone-600 font-serif leading-7">
              Satvegik makes stone-ground, savoury, gourmet nut butters from home-grown ingredients with patient craft and a naturally luxurious finish.
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4B3621]">
              Stone-Ground • Savoury • Gourmet • Home-Grown
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4B3621] font-bold hover:text-[#A67B5B] transition-colors"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Contact Care
            </Link>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h5 className="font-bold text-[#4B3621] uppercase tracking-[0.22em] text-xs mb-5">
                {section}
              </h5>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-serif text-sm text-stone-600 hover:text-[#8C7355] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#decdb8] pt-8 flex flex-col md:flex-row justify-between gap-4 text-center md:text-left">
          <p className="text-[#4B3621] text-[11px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em] opacity-80">
            (c) 2024 Satvegik. Crafted for the slow pace.
          </p>
          <p className="text-stone-500 text-[11px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em]">
            Mob: 9607195225 / Email: Satvegik@gmail.com
          </p>
        </div>
      </div>
    </footer>
  )
}
