import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'

const details = [
  ['mail', 'Email', 'hello@heritagebutters.com'],
  ['call', 'Phone', '+91 98765 43210'],
  ['location_on', 'Studio', 'The Artisanal District, Block 42, Pondicherry, India 605001'],
]

export default function ContactPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-24 px-6 md:px-12 flex flex-col items-center text-center max-w-screen-xl mx-auto">
          <h1 className="font-serif text-[48px] md:text-[64px] leading-tight text-primary mb-6">Get in Touch</h1>
          <p className="text-lg leading-8 text-secondary max-w-2xl font-light">
            We value the connection between provenance and people. Reach out for inquiries about our artisanal process or wholesale opportunities.
          </p>
        </section>

        {/* Contact Content */}
        <section className="px-6 md:px-12 pb-[120px] max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
            {/* Left Column: Details */}
            <div className="space-y-12">
              <div className="space-y-8">
                {details.map(([icon, title, value]) => (
                  <div key={title} className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-primary mb-1">{title}</h3>
                      <p className="text-secondary font-light">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-outline-variant">
                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.18em] mb-4">Studio Hours</h4>
                <div className="space-y-2 text-secondary font-light">
                  <div className="flex justify-between max-w-xs"><span>Mon - Fri</span><span>09:00 - 18:00</span></div>
                  <div className="flex justify-between max-w-xs"><span>Sat</span><span>10:00 - 14:00</span></div>
                  <div className="flex justify-between max-w-xs opacity-50"><span>Sun</span><span>Closed</span></div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="bg-surface-container-low p-10 lg:p-12 rounded-[28px] shadow-[0_20px_50px_rgba(140,115,85,0.08)] border border-surface-container-highest/30">
              <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
                <Field label="Name" placeholder="Your full name" type="text" />
                <Field label="Email Address" placeholder="hello@example.com" type="email" />
                <label className="space-y-2 block">
                  <span className="text-xs font-bold text-primary uppercase tracking-[0.18em] ml-1">Your Message</span>
                  <textarea className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-container transition-colors py-3 px-1 text-on-surface placeholder:text-outline-variant resize-none" placeholder="How can we help you?" rows="4" />
                </label>
                <button className="w-full mt-4 bg-primary text-on-primary py-5 px-8 text-xs font-bold uppercase tracking-[0.18em] rounded-full hover:bg-primary-container transition-all duration-300 shadow-md flex justify-center items-center gap-2" type="submit">
                  Send Message
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Full Width Image Section */}
        <section className="w-full h-[600px] overflow-hidden relative group">
          <img alt="Heritage Studio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwj3V93qWiTrYH1WMP_RkYunQInrBR9kjUfeJzLYHx1rWmW4NRqosRztyVnDtKCI7YjlefIFeMkvHpByx85a_FXEM-60p87epLRuXyVjugPFRWiidTL8Qta5LbVL-dc0bgWhx3wjwV32H4GgAFwFUCaUifRGJELvMGIjvF34i2Kn8p20_H_r63JdgCcaHFLMmAg-CXApi-0OJg8Oqyi70bLKiyhJ63c6IyeYhgKvE_vNJHDcSTjHEOUz5OseyrN7aIWiQv4ybOACY" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="bg-surface/80 backdrop-blur-md p-10 max-w-md text-center shadow-2xl rounded-[28px] border border-white/20">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">restaurant</span>
              <h2 className="font-serif text-4xl text-primary mb-2">Visit Our Studio</h2>
              <p className="text-secondary font-light">Experience the traditional churning process firsthand at our flagship location in the heart of Pondicherry.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Field({ label, placeholder, type }) {
  return (
    <label className="space-y-2 block">
      <span className="text-xs font-bold text-primary uppercase tracking-[0.18em] ml-1">{label}</span>
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-container transition-colors py-3 px-1 text-on-surface placeholder:text-outline-variant" placeholder={placeholder} type={type} />
    </label>
  )
}
