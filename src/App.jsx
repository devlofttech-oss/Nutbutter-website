import { Routes, Route } from 'react-router-dom'
import AboutPage from './pages/AboutPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import RefundPolicyPage from './pages/RefundPolicyPage.jsx'
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import WelcomePopup from './components/WelcomePopup.jsx'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/policies/terms" element={<TermsPage />} />
        <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
        <Route path="/policies/refund" element={<RefundPolicyPage />} />
      </Routes>
      <WelcomePopup />
    </>
  )
}
