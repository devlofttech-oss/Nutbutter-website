import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  return (
    <article className="group flex flex-col space-y-md">
      <Link to="/blog" className="aspect-[4/5] overflow-hidden rounded-lg bg-surface-container shadow-sm">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={post.image}
          alt={post.title}
        />
      </Link>
      <div className="space-y-sm">
        <div className="flex items-center gap-sm text-label-sm uppercase tracking-widest text-secondary/70">
          <span>{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-secondary/40" />
          <span>{post.readTime}</span>
        </div>
        <h2 className="font-serif text-headline-md text-primary leading-tight group-hover:text-secondary transition-colors">
          {post.title}
        </h2>
        <p className="text-body-md text-on-surface-variant line-clamp-3">{post.excerpt}</p>
        <Link
          className="inline-flex items-center gap-xs text-label-md font-semibold text-primary underline underline-offset-4 group-hover:gap-sm transition-all"
          to="/blog"
        >
          Read More <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </article>
  )
}
