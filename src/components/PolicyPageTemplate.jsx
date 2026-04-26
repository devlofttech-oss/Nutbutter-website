import Header from './Header.tsx'
import Footer from './Footer.tsx'
import PolicyHero from './PolicyHero.jsx'
import PolicySidebar from './PolicySidebar.jsx'
import PolicySection from './PolicySection.jsx'

export default function PolicyPageTemplate({ policy }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface selection:bg-primary-container selection:text-white">
      <Header />
      <main className="flex-grow">
        <PolicyHero policy={policy} />

        <section className="pb-xl px-8 md:px-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-lg">
            <PolicySidebar sections={policy.sections} />

            <div className="md:col-span-9 space-y-xl">
              {policy.sections.map((section, index) => (
                <PolicySection key={section.id} index={index} section={section} />
              ))}

              <div className="pt-lg border-t border-outline-variant text-center md:text-left">
                <p className="text-body-md text-on-surface-variant mb-md">{policy.contactText}</p>
                <a
                  className="inline-block px-lg py-sm bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:opacity-90 transition-all uppercase tracking-widest active:scale-95"
                  href={policy.contactHref}
                >
                  {policy.contactLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
