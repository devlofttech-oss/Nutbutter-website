import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isCurrentUserAdmin } from '../api/adminApi.js'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'
import PageLoader from './PageLoader.jsx'

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuthSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (isLoading) return undefined

    if (!user) {
      setIsChecking(false)
      return undefined
    }

    isCurrentUserAdmin(user.id)
      .then((result) => {
        if (isMounted) setIsAdmin(result)
      })
      .finally(() => {
        if (isMounted) setIsChecking(false)
      })

    return () => {
      isMounted = false
    }
  }, [isLoading, user])

  if (isLoading || isChecking) {
    return (
      <div className="bg-background text-on-surface min-h-screen p-8">
        <PageLoader message="Checking admin access..." />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return children
}

