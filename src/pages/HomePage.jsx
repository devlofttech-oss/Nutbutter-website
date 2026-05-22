import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import HeroCarousel from '../components/HeroCarousel.jsx'
import popupVideo from '../../assets/popup.mp4'
import breakfastImage from '../../img/breakfast.jpg'
import dessertImage from '../../img/dessert.jpg'
import gymImage from '../../img/gym.jpg'
import kidsImage from '../../img/kids.jpg'

const benefits = [
  ['eco', '100% Natural'],
  ['oil_barrel', 'No Palm Oil'],
  ['fitness_center', 'High Protein'],
  ['verified', 'No Preservatives'],
]

const useCases = [
  ['Breakfast', 'Drizzled over overnight oats or artisan sourdough.', breakfastImage],
  ['Gym', 'Clean protein fuel for your pre-workout boost.', gymImage],
  ['Dessert', 'The perfect companion for dark chocolate and fruit.', dessertImage],
  ['Kids', 'Nutrition that actually tastes like a treat.', kidsImage],
]

const testimonials = [
  ['Sarah J.', 'Verified Buyer', '"The smoothest almond butter I have ever tasted. It is like silk in a jar."'],
  ['Michael R.', 'Nutritionist', '"Finally, a brand that does not hide behind palm oil and added refined sugar."'],
  ['Emma L.', 'Home Chef', '"The Cacao Hazelnut is dangerous. It is way better than the usual chocolate spreads."'],
]

export default function HomePage() {
  return (
    <div className="bg-background text-on-surface">
      <div className="sticky top-0 z-[60] bg-surface-container-low text-on-surface-variant px-4 py-2 text-center text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] md:tracking-[0.18em] border-b border-outline-variant/30">
        Satvegik • Stone-Ground • Savoury • Gourmet • Home-Grown
      </div>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-[150px] bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 items-center gap-10 md:gap-16">
            <div className="space-y-6 md:space-y-8">
              <h1 className="font-serif text-[40px] sm:text-[44px] md:text-[72px] leading-[1.08] md:leading-[1.04] text-on-surface">
                <span className="italic font-normal">Stone-Ground Nut & SeedButters.</span>
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg leading-7 md:leading-8 max-w-lg">
                Home-grown ingredients, savoury craft, and patient stone-grinding come together in small-batch spreads with a naturally luxurious finish.
              </p>
              <div className="relative flex justify-center md:hidden">
                <div className="absolute -inset-10 bg-tertiary/5 rounded-full blur-3xl opacity-70" />
                <HeroCarousel className="group aspect-[4/5]" />
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 md:pt-4">
                <Link to="/shop" className="w-full sm:w-auto text-center bg-primary text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-full text-xs font-bold uppercase tracking-[0.16em] md:tracking-[0.2em] hover:bg-primary-container transition-colors shadow-lg shadow-primary/10">
                  Shop Now
                </Link>
                <Link to="/about" className="w-full sm:w-auto text-center border border-primary text-primary px-8 md:px-10 py-4 md:py-5 rounded-full text-xs font-bold uppercase tracking-[0.16em] md:tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all">
                  Explore
                </Link>
              </div>
            </div>
            <div className="relative hidden justify-center md:flex">
              <div className="absolute -inset-10 bg-tertiary/5 rounded-full blur-3xl opacity-70" />
              <HeroCarousel className="group aspect-[4/5]" />
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="bg-surface-container py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-between gap-5 md:gap-16">
            {benefits.map(([icon, label]) => (
              <div key={label} className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-3 rounded-full">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant group-hover:text-tertiary transition-colors">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className="bg-surface-dim py-16 md:py-[120px] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 text-center space-y-8 md:space-y-12">
            <h2 className="font-serif text-[34px] md:text-[56px] leading-tight text-on-surface">See how we make it fresh</h2>
            <div className="aspect-video bg-surface-container relative rounded-[22px] md:rounded-[28px] overflow-hidden group cursor-pointer shadow-2xl">
              <video
                aria-label="Satvegik churning process video"
                autoPlay
                className="h-full w-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                loop
                muted
                playsInline
                src={popupVideo}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-primary/5 to-white/10" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-full border border-white/40 bg-white/20 px-4 py-3 text-left text-white shadow-lg backdrop-blur-md md:bottom-6 md:left-6 md:right-6 md:px-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Fresh churning</span>
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Section */}
        <section className="py-16 md:py-[120px] max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">Made for Every Moment</h2>
            <p className="text-on-surface-variant mt-4">Versatile energy for your daily rituals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map(([title, body, image]) => (
              <div key={title} className="relative h-72 md:h-80 overflow-hidden rounded-xl border border-white/60 bg-surface-container-low p-6 md:p-8 flex flex-col justify-end shadow-[0_18px_45px_rgba(115,91,66,0.09)] group">
                <img className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" src={image} alt={`${title} with nut butter`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f2115]/55 via-[#4b3621]/15 to-white/5" />
                <div className="relative z-10">
                  <h4 className="font-serif text-2xl text-white drop-shadow-sm">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-white/90 drop-shadow-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-container-low py-16 md:py-[120px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              {testimonials.map(([name, role, quote]) => (
                <div key={name} className="space-y-6">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-serif text-xl md:text-2xl text-on-surface italic">{quote}</p>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface">{name}</p>
                    <p className="text-xs text-on-surface-variant">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-[120px] max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid md:grid-cols-2 gap-10 md:gap-24 items-center">
          <div className="order-2 md:order-1">
            <img alt="The Farm" className="w-full aspect-[4/5] object-cover rounded-[28px] grayscale-[15%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANYdeCa2d4k19IC6HPG-rE-7GSxKgy-jtikC8RhLjTRYp5kzLxeI3fBpJqpgN83sG9OGUnzVCsjurG_I2OZ0s19kd12vdHxlud8x6an56lqsMzUlHEkT04Zaf-wHrcXKqNsY51cZ8epU6We6N0m18yf3uXhgVlRc-jEq4Xc8u9zLSPY6RIj0iZUZMjDXe9b8_wMx7nZe47_CCgjUfGAW6cuWczBNNvuYYnbFHUFsqOWUQavlLQlYwcWjqyprGQf9lvkpJygsMIOO8" />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <span className="text-tertiary text-xs font-bold uppercase tracking-[0.22em]">Our Story</span>
            <h2 className="font-serif text-[34px] md:text-[56px] leading-tight text-on-surface">Crafting purity since 1924.</h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-7 md:leading-8">Our heritage began in a small stone mill where we believed that the best food needs the least interference. Today, we still use slow-roasting techniques and stone-grinders to ensure every jar retains its natural soul.</p>
            <p className="text-on-surface-variant leading-7">We partner with family-owned groves that prioritize soil health and biodiversity. It is not just about the butter, it is about preserving a way of life that respects the land and our bodies.</p>
            <Link to="/about" className="inline-block border-b-2 border-primary text-primary pb-1 text-xs font-bold uppercase tracking-[0.18em] hover:text-primary-container transition-colors">Learn More About Our Mission</Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-primary-container text-on-primary-container text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 space-y-6 md:space-y-8">
            <h2 className="font-serif text-[34px] md:text-[56px] leading-tight">Ready to eat healthy?</h2>
            <p className="text-on-primary/80 text-base md:text-lg">Taste the difference that three generations of artisanal craft makes.</p>
            <Link to="/shop" className="inline-block bg-white text-primary px-8 md:px-12 py-4 md:py-5 rounded-full text-xs font-bold uppercase tracking-[0.16em] md:tracking-[0.18em] hover:bg-surface-container transition-all">Shop the collection</Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
