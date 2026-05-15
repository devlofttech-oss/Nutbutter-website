import { BUSINESS_CONTACT } from './constants.js'

export const CONTACT_INFO = [
  {
    icon: 'mail',
    title: 'Email',
    lines: [BUSINESS_CONTACT.email],
  },
  {
    icon: 'call',
    title: 'Phone',
    lines: [BUSINESS_CONTACT.phone, BUSINESS_CONTACT.tagline],
  },
  {
    icon: 'location_on',
    title: 'Studio Address',
    lines: [BUSINESS_CONTACT.address],
  },
  {
    icon: 'schedule',
    title: 'Working Hours',
    lines: ['Monday - Friday: 09:00 - 18:00', 'Saturday: 10:00 - 14:00'],
  },
]

export const CONTACT_FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 9607195225', required: false },
]

export const MAP_DETAILS = {
  title: 'Satvegik Studio',
  subtitle: BUSINESS_CONTACT.address,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWjVvY8xuFCPzT-JtlByr0H8JvAru2cXO1ZR246013MR1lFPx8kh1qoshnr2_O8JA_9826TdkbzlYC1W1m-IlCX86TMR5el8dY1T7UxWXP9b_bWWkiKJ3-xQgN-uxiAH5a5QiFRiTKZHa0oyZKOUh3S-1NRt598mDdoeGA8uac9WCI_xnHhz9vxEzx5MZ9JpPQJVmTYy8XYhDqEPLDVvFSP9l8kPDObxeGw948hwci2185GRO131YyUxddUP8hiwq0KJO8wmFyf2A',
}
