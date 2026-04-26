export default function PolicySection({ index, section }) {
  return (
    <article className="scroll-mt-32" id={section.id}>
      <div className="flex items-center gap-4 mb-md">
        <span className="text-tertiary-fixed-dim font-serif text-headline-md">
          {String(index + 1).padStart(2, '0')}.
        </span>
        <h2 className="font-serif text-headline-lg text-primary">{section.title}</h2>
      </div>

      <div className="space-y-6 text-body-md text-on-surface-variant leading-relaxed">
        {section.blocks.map((block, blockIndex) => (
          <PolicyBlock key={`${section.id}-${blockIndex}`} block={block} />
        ))}
      </div>
    </article>
  )
}

function PolicyBlock({ block }) {
  if (block.type === 'callout') {
    return (
      <div className="bg-surface-container p-md md:p-lg rounded-lg border border-outline-variant italic text-primary">
        {block.text}
      </div>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className="list-none space-y-4">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-sm mt-1">check_circle</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'images') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {block.images.map((image) => (
          <div key={image.src} className="h-48 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
            <img alt={image.alt} className="w-full h-full object-cover" src={image.src} />
          </div>
        ))}
      </div>
    )
  }

  return <p>{block.text}</p>
}
