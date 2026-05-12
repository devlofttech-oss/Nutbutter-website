import { useEffect, useRef, useState } from 'react'
import { HERO_SLIDES } from '../data/heroSlides.js'

const AUTOPLAY_DELAY = 3800
const SWIPE_THRESHOLD = 48

export default function HeroCarousel({ className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(null)

  const goToSlide = (index) => {
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const goToNext = () => goToSlide(activeIndex + 1)
  const goToPrevious = () => goToSlide(activeIndex - 1)

  useEffect(() => {
    if (isPaused) {
      return undefined
    }

    const autoplay = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % HERO_SLIDES.length)
    }, AUTOPLAY_DELAY)

    return () => window.clearInterval(autoplay)
  }, [isPaused])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return
    }

    const distance = touchStartX.current - event.changedTouches[0].clientX

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }

    touchStartX.current = null
    setIsPaused(false)
  }

  return (
    <div
      aria-label="Featured nut butter carousel"
      className={`relative z-10 w-full max-w-sm md:max-w-md overflow-hidden rounded-[24px] md:rounded-[32px] bg-surface-container-low shadow-[0_35px_80px_rgba(111,88,60,0.18)] transition-transform duration-700 hover:scale-105 ${className}`}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <figure
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.035]'
            }`}
            key={slide.id}
          >
            <img
              alt={slide.alt}
              className="h-full w-full object-cover"
              src={slide.image}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4B3621]/10 via-transparent to-white/20" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fff9ef]/45 to-transparent" />
          </figure>
        )
      })}

      <button
        aria-label="Previous slide"
        className="absolute inset-y-0 left-3 hidden items-center text-primary opacity-0 transition-opacity duration-300 hover:opacity-80 md:flex md:group-hover:opacity-100"
        type="button"
        onClick={goToPrevious}
      >
        <span className="material-symbols-outlined rounded-full bg-white/70 p-2 backdrop-blur-md shadow-sm">
          chevron_left
        </span>
      </button>

      <button
        aria-label="Next slide"
        className="absolute inset-y-0 right-3 hidden items-center text-primary opacity-0 transition-opacity duration-300 hover:opacity-80 md:flex md:group-hover:opacity-100"
        type="button"
        onClick={goToNext}
      >
        <span className="material-symbols-outlined rounded-full bg-white/70 p-2 backdrop-blur-md shadow-sm">
          chevron_right
        </span>
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/45 px-3 py-2 backdrop-blur-md">
        {HERO_SLIDES.map((slide, index) => (
          <button
            aria-label={`Show ${slide.name}`}
            aria-current={index === activeIndex}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/60'
            }`}
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
