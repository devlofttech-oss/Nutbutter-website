import { Link } from 'react-router-dom'

export default function FaqCTA() {
  return (
    <section className="overflow-hidden rounded-xl p-6 md:p-lg bg-primary-container text-on-primary mt-12 md:mt-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-md text-center md:text-left">
        <div>
          <h3 className="font-serif text-2xl md:text-headline-lg text-white mb-2">Still have questions?</h3>
          <p className="text-on-primary/80">
            Our team is here to help with storage, subscriptions, gifting, and custom orders.
          </p>
        </div>
        <Link
          className="w-full sm:w-auto text-center px-8 py-4 bg-background text-primary font-semibold rounded-full hover:bg-surface-container transition-colors shadow-lg active:scale-95"
          to="/contact"
        >
          Contact Our Team
        </Link>
      </div>
    </section>
  )
}
