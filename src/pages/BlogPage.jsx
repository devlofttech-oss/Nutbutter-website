import { useMemo, useState } from 'react'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import BlogHero from '../components/BlogHero.jsx'
import CategoryTabs from '../components/CategoryTabs.jsx'
import BlogCard from '../components/BlogCard.jsx'
import FeaturedArticle from '../components/FeaturedArticle.jsx'
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/blogData.js'

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory
      const matchesSearch = !normalizedSearch
        || post.title.toLowerCase().includes(normalizedSearch)
        || post.excerpt.toLowerCase().includes(normalizedSearch)
        || post.category.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm])

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto">
        <BlogHero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryTabs
          categories={BLOG_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <section className="px-8 md:px-12 mb-xl">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container rounded-xl border border-outline-variant p-xl text-center">
              <span className="material-symbols-outlined text-5xl text-secondary mb-md">search_off</span>
              <h2 className="font-serif text-headline-md text-primary mb-sm">No recipes found</h2>
              <p className="text-body-md text-on-surface-variant">
                Try a different category or search term.
              </p>
            </div>
          )}
        </section>

        <FeaturedArticle />
      </main>
      <Footer />
    </div>
  )
}
