export default function PolicySidebar({ sections }) {
  return (
    <aside className="md:col-span-3">
      <nav className="md:sticky md:top-32">
        <div className="md:hidden overflow-x-auto mb-lg">
          <div className="flex gap-md border-b border-outline-variant pb-4 min-w-max">
            {sections.map((section) => (
              <a
                key={section.id}
                className="text-label-md font-semibold text-secondary hover:text-primary transition-colors"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-6">
          {sections.map((section, index) => (
            <a
              key={section.id}
              className={`text-label-md font-semibold pl-4 transition-colors ${
                index === 0
                  ? 'text-primary border-l-2 border-primary'
                  : 'text-on-surface-variant border-l-2 border-transparent hover:text-primary'
              }`}
              href={`#${section.id}`}
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  )
}
