export default function CategoryTabs({ categories, activeCategory, onSelectCategory }) {
  return (
    <section className="px-8 md:px-12 mb-lg overflow-x-auto">
      <div className="flex justify-start md:justify-center items-center gap-lg border-b border-outline-variant pb-4 min-w-max">
        {categories.map((category) => {
          const isActive = category === activeCategory
          return (
            <button
              key={category}
              className={`text-label-md font-semibold pb-2 transition-colors ${
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-secondary hover:text-primary'
              }`}
              type="button"
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          )
        })}
      </div>
    </section>
  )
}
