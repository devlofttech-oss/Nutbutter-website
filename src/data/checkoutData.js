import { INITIAL_CART_ITEMS } from './cartData.js'

export const CHECKOUT_ITEMS = INITIAL_CART_ITEMS

export const CUSTOMER_FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Elias Thorne' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'elias@example.com' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'e.g. 9607195225' },
  { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Oak Lane', wide: true },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Bengaluru' },
  { name: 'state', label: 'State', type: 'text', placeholder: 'KA' },
  { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '560001' },
]

export const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    title: 'Standard Delivery',
    description: '3-5 business days',
    price: 79,
  },
  {
    id: 'express',
    title: 'Express Delivery',
    description: 'Next day delivery',
    price: 149,
  },
]

export const PAYMENT_OPTIONS = [
  {
    id: 'upi',
    title: 'UPI',
    icon: 'qr_code_2',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    icon: 'payments',
  },
]
