export default function Seo({ title = 'Satvegik', description = 'Stone-ground, savoury, gourmet, home-grown nut butters by Satvegik.' }) {
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
