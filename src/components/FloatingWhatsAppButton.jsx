import { useLocation } from 'react-router-dom'
import { BUSINESS_CONTACT } from '../data/constants.js'

const WHATSAPP_URL = 'https://wa.me/919607195225'

const HIDDEN_ROUTE_PREFIXES = [
  '/admin',
  '/auth',
  '/checkout',
  '/forgot-password',
  '/login',
  '/logout',
  '/payment',
  '/reset-password',
  '/signup',
]

export default function FloatingWhatsAppButton() {
  const { pathname } = useLocation()
  const shouldHide = HIDDEN_ROUTE_PREFIXES.some((routePrefix) => (
    pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)
  ))

  if (shouldHide) {
    return null
  }

  return (
    <a
      aria-label={`Chat with Satvegik on WhatsApp at ${BUSINESS_CONTACT.phone}`}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_32px_rgba(37,211,102,0.35)] ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-[0_18px_38px_rgba(37,211,102,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 active:scale-95 md:bottom-8 md:right-8 md:h-16 md:w-16"
      href={WHATSAPP_URL}
      rel="noreferrer"
      target="_blank"
      title="Chat on WhatsApp"
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8 md:h-9 md:w-9"
        fill="currentColor"
        viewBox="0 0 32 32"
      >
        <path d="M16.02 3.2A12.74 12.74 0 0 0 5.08 22.5L3.6 28.8l6.46-1.46A12.74 12.74 0 1 0 16.02 3.2Zm0 2.4a10.34 10.34 0 0 1 8.8 15.76 10.35 10.35 0 0 1-13.99 3.39l-.4-.24-3.6.81.82-3.49-.27-.42A10.34 10.34 0 0 1 16.02 5.6Zm-4.13 4.74c-.23 0-.58.09-.88.42-.3.33-1.16 1.13-1.16 2.76s1.19 3.21 1.35 3.43c.17.22 2.29 3.66 5.67 4.98 2.8 1.1 3.38.88 3.99.83.61-.06 1.98-.81 2.26-1.59.28-.78.28-1.45.19-1.59-.08-.14-.31-.22-.66-.39-.35-.17-2.05-1.01-2.37-1.12-.32-.12-.55-.17-.78.17-.23.35-.9 1.12-1.1 1.35-.2.23-.41.26-.76.09-.35-.17-1.46-.54-2.79-1.72-1.03-.92-1.73-2.05-1.93-2.4-.2-.35-.02-.54.15-.71.15-.15.35-.41.52-.61.17-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.17-.77-1.91-1.08-2.6-.28-.66-.57-.67-.84-.68h-.66Z" />
      </svg>
    </a>
  )
}
