import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPageShell } from './LoginPage.jsx'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function LogoutPage() {
  const navigate = useNavigate()
  const { signOut } = useAuthSession()

  useEffect(() => {
    signOut().finally(() => navigate('/login', { replace: true }))
  }, [navigate, signOut])

  return (
    <AuthPageShell title="Signing Out" subtitle="Clearing your session." />
  )
}
