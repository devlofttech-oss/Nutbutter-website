import { Link } from 'react-router-dom'
import { BUSINESS_CONTACT, FOOTER_LINKS, SOCIAL_LINKS } from '../data/constants.js'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#eadfd2] bg-[#f4e9dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9 md:gap-12 mb-12 md:mb-14">
          <div className="md:pr-8">
            <div className="mb-5">
              <img className="h-[65px] w-auto object-contain drop-shadow-[0_8px_18px_rgba(75,54,33,0.12)]" src={logo} alt="Satvegik" />
            </div>
            <p className="text-sm text-stone-600 font-serif leading-7">
              Satvegik makes stone-ground, savoury, gourmet nut butters from home-grown ingredients with patient craft and a naturally luxurious finish.
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4B3621]">
              {BUSINESS_CONTACT.tagline}
            </p>
            <div className="mt-5 space-y-2 font-serif text-sm text-stone-600">
              <p>Email: <a className="hover:text-[#8C7355]" href={`mailto:${BUSINESS_CONTACT.email}`}>{BUSINESS_CONTACT.email}</a></p>
              <p>Phone: <a className="hover:text-[#8C7355]" href={`tel:${BUSINESS_CONTACT.phone.replace(/\s/g, '')}`}>{BUSINESS_CONTACT.phone}</a></p>
            </div>
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

        <div className="border-t border-[#decdb8] pt-6 pb-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs uppercase tracking-[0.16em] text-[#4B3621]">
          {SOCIAL_LINKS.map((link) => (
            link.href ? (
              <a key={link.label} className="inline-flex items-center gap-2 text-stone-600 hover:text-[#8C7355] transition-colors" href={link.href} rel="noreferrer" target="_blank">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <rect height="18" rx="5" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" fill="currentColor" r="1.25" />
                </svg>
                {link.label}
              </a>
            ) : (
              <span key={link.label} className="text-stone-500">{link.label}</span>
            )
          ))}
        </div>

        <div className="border-t border-[#decdb8] pt-8 flex flex-col md:flex-row justify-between gap-4 text-center md:text-left">
          <p className="text-[#4B3621] text-[11px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em] opacity-80">
            &copy; {new Date().getFullYear()} Satvegik. All rights reserved.
          </p>
          <div className="space-y-2 md:text-right">
            <p className="text-stone-500 text-[11px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em]">
              Secure online payments. Freshly packed orders.
            </p>
            <a
              className="inline-block text-[#4B3621] text-[11px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em] opacity-80 transition-colors hover:text-[#8C7355]"
              href="https://www.devlofttech.com"
              rel="noreferrer"
              target="_blank"
            >
              Developed &amp; Designed by Devloft Techmologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
