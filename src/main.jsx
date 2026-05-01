import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthSessionProvider } from './providers/AuthSessionProvider.jsx'
import { CartProvider } from './providers/CartProvider.jsx'
import { ToastProvider } from './providers/ToastProvider.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthSessionProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </AuthSessionProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
