import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AboutPage from './pages/AboutPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import OrderDetailPage from './pages/OrderDetailPage.jsx'
import PaymentFailedPage from './pages/PaymentFailedPage.jsx'
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import RefundPolicyPage from './pages/RefundPolicyPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import WelcomePopup from './components/WelcomePopup.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import PageLoader from './components/PageLoader.jsx'
import Seo from './components/Seo.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton.jsx'

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage.jsx'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage.jsx'))
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage.jsx'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage.jsx'))
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage.jsx'))

export default function App() {
  const { pathname } = useLocation()
  const isHomePage = pathname === '/'

  return (
    <>
      <ScrollToTop />
      <Seo />
      <Suspense fallback={<PageLoader message="Loading page..." />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Navigate to="/shop" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
          <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailedPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessagesPage /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/policies/terms" element={<TermsPage />} />
          <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
          <Route path="/policies/refund" element={<RefundPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <FloatingWhatsAppButton />
      {isHomePage ? <WelcomePopup /> : null}
    </>
  )
}
