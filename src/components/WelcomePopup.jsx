import { useEffect, useRef, useState } from 'react'
import PopupForm from './PopupForm.jsx'
import popupVideo from '../../assets/popup.mp4'

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const closePopup = () => setIsOpen(false)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-primary/50 backdrop-blur-md"
      role="presentation"
    >
      <section
        aria-labelledby="welcome-popup-title"
        aria-modal="true"
        className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-surface shadow-[0_20px_40px_rgba(75,54,33,0.18)] border border-outline-variant flex flex-col md:flex-row"
        role="dialog"
      >
        <button
          ref={closeButtonRef}
          aria-label="Close welcome offer"
          className="absolute top-4 right-4 z-20 text-on-surface-variant hover:text-primary transition-colors active:scale-95"
          type="button"
          onClick={closePopup}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="hidden md:block w-5/12 relative min-h-[520px] bg-surface-container">
          <video
            aria-label="Satvegik nut butter welcome video"
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
            src={popupVideo}
          />
          <div className="absolute inset-0 bg-primary/10" />
        </div>

        <div className="flex-1 p-lg md:p-xl flex flex-col items-center text-center justify-center space-y-md">
          <div className="mb-xs">
            <span className="text-[#4B3621] font-serif text-headline-md font-bold italic tracking-tight">
              Satvegik
            </span>
          </div>

          <div className="space-y-sm">
            <h2 id="welcome-popup-title" className="font-serif text-headline-lg text-primary leading-tight">
              Fuel Your Day Naturally
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Get 10% off your first purchase of stone-ground nut butters.
            </p>
          </div>

          <PopupForm onDismiss={closePopup} onSuccess={closePopup} />

          <div className="pt-sm opacity-25 text-secondary">
            <span className="material-symbols-outlined text-4xl">eco</span>
          </div>
        </div>
      </section>
    </div>
  )
}
