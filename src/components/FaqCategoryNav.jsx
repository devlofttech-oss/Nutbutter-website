export default function FaqCategoryNav({ sections }) {
  return (
    <aside className="lg:col-span-3">
      <nav className="lg:sticky lg:top-32">
        <div className="lg:hidden overflow-x-auto mb-lg">
          <div className="flex gap-md border-b border-outline-variant pb-4 min-w-max">
            {sections.map((section) => (
              <a
                key={section.id}
                className="text-label-md font-semibold text-secondary hover:text-primary transition-colors"
                href={`#${section.id}`}
              >
                {section.navLabel}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-6">
          {sections.map((section, index) => (
            <a
              key={section.id}
              className={`group flex items-center gap-4 text-label-md transition-colors hover:text-secondary ${
                index === 0 ? 'text-primary' : 'text-on-surface-variant'
              }`}
              href={`#${section.id}`}
            >
              <span className="w-8 h-px bg-outline-variant group-hover:bg-secondary group-hover:w-12 transition-all" />
              {section.navLabel}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  )
}
