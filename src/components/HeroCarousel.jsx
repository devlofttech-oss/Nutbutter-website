import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SLIDES } from '../data/heroSlides.js'

const AUTOPLAY_DELAY = 3600
const SWIPE_THRESHOLD = 48

export default function HeroCarousel() {
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
    <section
      aria-label="Featured nut butter carousel"
      className="relative h-[72vh] min-h-[560px] max-h-[820px] overflow-hidden bg-surface-container-low"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex

        return (
          <div
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            key={slide.id}
          >
            <img
              alt={slide.alt}
              className="h-full w-full object-cover"
              src={slide.image}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-[#F5EFE6]/25 to-[#fff9ef]/80" />
            <div className="absolute inset-0 bg-primary/5" />
          </div>
        )
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-sm text-label-md font-semibold uppercase tracking-[0.25em] text-secondary">
          {HERO_SLIDES[activeIndex].name}
        </p>
        <h1 className="font-serif text-[42px] leading-tight md:text-headline-xl text-primary mb-md max-w-3xl">
          Stone Ground Nut Butters
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-lg tracking-wide">
          Pure Ingredients &bull; No Junk &bull; Premium Nutrition
        </p>
        <Link to="/shop">
          <button className="bg-[#C2A38E] text-white px-xl py-sm rounded-full text-label-md font-semibold uppercase tracking-widest hover:shadow-lg hover:-translate-y-1 transition-all duration-500 active:scale-95">
            Shop Now
          </button>
        </Link>
      </div>

      <button
        aria-label="Previous slide"
        className="absolute inset-y-0 left-base md:left-md flex items-center text-primary hover:opacity-60 transition-opacity"
        type="button"
        onClick={goToPrevious}
      >
        <span className="material-symbols-outlined rounded-full bg-white/70 p-base backdrop-blur-md shadow-sm">
          chevron_left
        </span>
      </button>

      <button
        aria-label="Next slide"
        className="absolute inset-y-0 right-base md:right-md flex items-center text-primary hover:opacity-60 transition-opacity"
        type="button"
        onClick={goToNext}
      >
        <span className="material-symbols-outlined rounded-full bg-white/70 p-base backdrop-blur-md shadow-sm">
          chevron_right
        </span>
      </button>

      <div className="absolute bottom-lg left-1/2 flex -translate-x-1/2 gap-sm">
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
    </section>
  )
}
