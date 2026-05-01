import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPageShell } from './LoginPage.jsx'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate('/shop', { replace: true })
    }, 800)

    return () => window.clearTimeout(timeoutId)
  }, [navigate])

  return (
    <AuthPageShell title="Signing You In" subtitle="Your session is being restored securely." />
  )
}

