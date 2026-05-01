import { Component } from 'react'
import Header from './Header.tsx'
import Footer from './Footer.tsx'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-7xl mx-auto w-full px-8 md:px-12 py-xl">
          <section className="bg-surface-container rounded-xl border border-outline-variant p-xl text-center">
            <h1 className="font-serif text-headline-xl text-primary mb-sm">Something went wrong</h1>
            <p className="text-on-surface-variant">Please refresh the page and try again.</p>
          </section>
        </main>
        <Footer />
      </div>
    )
  }
}

