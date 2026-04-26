import { Link } from 'react-router-dom'
import { FEATURED_ARTICLE } from '../data/blogData.js'

export default function FeaturedArticle() {
  return (
    <section className="px-8 md:px-12 mb-xl">
      <div className="bg-[#E6D5B8]/20 rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch border border-outline-variant">
        <div className="lg:w-1/2 min-h-[360px]">
          <img className="w-full h-full object-cover" src={FEATURED_ARTICLE.image} alt={FEATURED_ARTICLE.title} />
        </div>
        <div className="lg:w-1/2 p-lg md:p-xl flex flex-col justify-center">
          <span className="text-label-md font-semibold text-secondary uppercase tracking-widest mb-sm">
            {FEATURED_ARTICLE.eyebrow}
          </span>
          <h2 className="font-serif text-headline-lg text-primary mb-md">{FEATURED_ARTICLE.title}</h2>
          <p className="font-serif text-body-lg text-on-surface-variant mb-lg leading-relaxed">
            {FEATURED_ARTICLE.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-gutter">
            <Link to="/shop">
              <button className="bg-primary-container text-on-primary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide active:scale-95 hover:opacity-90 transition-all shadow-sm">
                Shop Nut Butters
              </button>
            </Link>
            <Link to="/blog">
              <button className="border border-secondary text-secondary px-lg py-sm rounded-lg text-sm font-semibold tracking-wide active:scale-95 hover:bg-surface-container transition-all">
                Full Recipe Guide
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
