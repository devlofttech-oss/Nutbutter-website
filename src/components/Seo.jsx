import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'

const DEFAULT_DESCRIPTION = 'Shop Satvegik stone-ground, savoury, gourmet nut butters made from home-grown ingredients with secure online checkout and reliable delivery.'

const ROUTE_METADATA = [
  ['/', 'Satvegik | Stone-Ground Nut & Seed Butters', DEFAULT_DESCRIPTION],
  ['/shop', 'Shop Nut Butters | Satvegik', 'Explore Satvegik nut and seed butters with clear pricing, shipping options, and secure PhonePe checkout.'],
  ['/about', 'About Us | Satvegik', 'Learn about Satvegik, our stone-ground process, clean ingredients, and small-batch approach to gourmet nut butters.'],
  ['/contact', 'Contact Us | Satvegik', 'Contact Satvegik for order support, wholesale inquiries, product questions, and customer care.'],
  ['/faq', 'FAQ | Satvegik', 'Find answers about Satvegik products, shipping, payments, cancellations, refunds, and care.'],
  ['/blog', 'Recipes | Satvegik', 'Read Satvegik recipes and serving ideas for clean, stone-ground nut and seed butters.'],
  ['/cart', 'Cart | Satvegik', 'Review your Satvegik cart before checkout.'],
  ['/checkout', 'Secure Checkout | Satvegik', 'Complete your Satvegik order with visible shipping charges, order summary, and secure PhonePe payment.'],
  ['/login', 'Login | Satvegik', 'Sign in to your Satvegik account to view orders and checkout faster.'],
  ['/signup', 'Create Account | Satvegik', 'Create a Satvegik account for faster checkout and order tracking.'],
  ['/forgot-password', 'Forgot Password | Satvegik', 'Reset access to your Satvegik account.'],
  ['/reset-password', 'Reset Password | Satvegik', 'Set a new Satvegik account password.'],
  ['/orders', 'My Orders | Satvegik', 'View your Satvegik orders, payment status, and shipment details.'],
  ['/payment/success', 'Order Confirmation | Satvegik', 'Confirm your Satvegik payment status and order details.'],
  ['/payment/failed', 'Payment Failed | Satvegik', 'Review a failed Satvegik payment and return to checkout safely.'],
  ['/privacy-policy', 'Privacy Policy | Satvegik', 'Read how Satvegik collects, uses, and protects customer information.'],
  ['/terms', 'Terms & Conditions | Satvegik', 'Read the terms and conditions for browsing, ordering, payment, and use of Satvegik services.'],
  ['/shipping-policy', 'Shipping Policy | Satvegik', 'Read Satvegik shipping timelines, delivery handling, tracking, and support information.'],
  ['/refund-policy', 'Refund & Cancellation Policy | Satvegik', 'Read Satvegik refund, replacement, return, and cancellation terms.'],
]

function upsertMeta(selector, attributes) {
  const existing = document.head.querySelector(selector)
  const element = existing ?? document.createElement('meta')

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  if (!existing) document.head.appendChild(element)
}

function upsertLink(selector, attributes) {
  const existing = document.head.querySelector(selector)
  const element = existing ?? document.createElement('link')

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  if (!existing) document.head.appendChild(element)
}

function getRouteMetadata(pathname) {
  if (pathname.startsWith('/product')) {
    return ['Product Details | Satvegik', 'View Satvegik product ingredients, pricing, nutrition details, customer reviews, and secure checkout options.']
  }

  if (pathname.startsWith('/admin')) {
    return ['Admin | Satvegik', 'Satvegik admin dashboard.']
  }

  const exactMatch = ROUTE_METADATA.find(([path]) => path === pathname)
  return exactMatch ? [exactMatch[1], exactMatch[2]] : ['Page Not Found | Satvegik', 'The requested Satvegik page could not be found.']
}

export default function Seo({ title, description, canonicalPath }) {
  const { pathname } = useLocation()
  const [routeTitle, routeDescription] = getRouteMetadata(pathname)
  const pageTitle = title ?? routeTitle
  const pageDescription = description ?? routeDescription

  useEffect(() => {
    const origin = window.location.origin
    const canonicalUrl = `${origin}${canonicalPath ?? pathname}`

    document.title = pageTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: pageDescription })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: new URL(logo, origin).href })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#4B3621' })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })
    upsertLink('link[rel="icon"]', { rel: 'icon', href: logo })
    upsertLink('link[rel="apple-touch-icon"]', { rel: 'apple-touch-icon', href: logo })
  }, [canonicalPath, pageDescription, pageTitle, pathname])

  return null
}
