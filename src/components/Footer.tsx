import { Link } from 'react-router-dom'
import { FOOTER_LINKS } from '../data/constants.js'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#eadfd2] bg-[#f4e9dc]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          <div className="md:pr-8">
            <div className="flex items-center gap-3 text-xl font-serif font-bold tracking-[0.12em] uppercase text-[#4B3621] mb-5">
              <img className="h-11 w-11 rounded-full object-cover" src={logo} alt="Satvegik logo" />
              <span>Satvegik</span>
            </div>
            <p className="text-sm text-stone-600 font-serif leading-7">
              Premium stone-ground nut butters made in small batches with clean ingredients, patient craft, and a naturally luxurious finish.
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
          <p className="text-[#4B3621] text-xs uppercase tracking-[0.2em] opacity-80">
            (c) 2024 Satvegik. Crafted for the slow pace.
          </p>
          <p className="text-stone-500 text-xs uppercase tracking-[0.2em]">
            Pure Ingredients / No Palm Oil / Small Batch
          </p>
        </div>
      </div>
    </footer>
  )
}
