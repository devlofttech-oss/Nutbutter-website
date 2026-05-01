import { Navigate, useLocation } from 'react-router-dom'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuthSession()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="rounded-[28px] border border-outline-variant bg-surface-container-low px-8 py-12 text-center text-on-surface-variant">
          Restoring your session...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

