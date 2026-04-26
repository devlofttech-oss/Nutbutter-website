export default function BlogHero({ searchTerm, onSearchChange }) {
  return (
    <section className="px-8 md:px-12 pt-xl pb-lg text-center">
      <span className="text-label-md font-semibold text-secondary uppercase tracking-widest">
        Slow nourishment
      </span>
      <h1 className="font-serif text-headline-xl text-primary mt-sm mb-md">Blog &amp; Recipes</h1>
      <p className="max-w-2xl mx-auto font-serif text-body-lg text-on-surface-variant leading-relaxed">
        Discover heritage-inspired breakfasts, protein-rich snacks, and quiet kitchen rituals that bring our artisanal nut butters into everyday life.
      </p>

      <div className="mt-md max-w-md mx-auto flex items-center bg-surface-container rounded-full border border-outline-variant px-md py-sm">
        <span className="material-symbols-outlined text-secondary text-base">search</span>
        <input
          className="ml-sm flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-on-surface-variant/50"
          placeholder="Search recipes..."
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </section>
  )
}
