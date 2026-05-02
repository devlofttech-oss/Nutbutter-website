import { Link } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import Seo from '../components/Seo.jsx'

export default function NotFoundPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Seo title="Page Not Found | Satvegik" />
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
        <section className="bg-surface-container rounded-xl border border-outline-variant p-xl text-center">
          <h1 className="font-serif text-headline-xl text-primary mb-sm">Page Not Found</h1>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-md">
            The page you are looking for is not available.
          </p>
          <Link className="inline-block bg-primary-container text-on-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide transition-all hover:opacity-90" to="/shop">
            Back to Shop
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
