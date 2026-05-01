export default function Seo({ title = 'Artisan Nut Co.', description = 'Premium stone-ground nut butters made in small batches.' }) {
  document.title = title

  const existingDescription = document.querySelector('meta[name="description"]')
  const descriptionTag = existingDescription ?? document.createElement('meta')
  descriptionTag.setAttribute('name', 'description')
  descriptionTag.setAttribute('content', description)

  if (!existingDescription) {
    document.head.appendChild(descriptionTag)
  }

  return null
}

