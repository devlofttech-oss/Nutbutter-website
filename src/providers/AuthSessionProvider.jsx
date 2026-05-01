import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  updatePassword,
} from '../api/authApi.js'
import { isSupabaseConfigured } from '../config/env.js'
import { supabase } from '../lib/supabaseClient.js'

const AuthSessionContext = createContext(null)

export function AuthSessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return undefined
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return

      if (sessionError) {
        setError(sessionError)
      }

      setSession(data.session)
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(false)
      setError(null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const runAuthAction = useCallback(async (action) => {
    setError(null)

    try {
      return await action()
    } catch (authError) {
      setError(authError)
      throw authError
    }
  }, [])

  const value = useMemo(() => ({
    session,
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    isSupabaseConfigured,
    signUp: (payload) => runAuthAction(() => signUpWithEmail(payload)),
    signIn: (payload) => runAuthAction(() => signInWithEmail(payload)),
    signInWithGoogle: () => runAuthAction(signInWithGoogle),
    resetPassword: (email) => runAuthAction(() => sendPasswordReset(email)),
    updatePassword: (password) => runAuthAction(() => updatePassword(password)),
    signOut: () => runAuthAction(signOutUser),
  }), [error, isLoading, runAuthAction, session, user])

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error('useAuthSession must be used inside AuthSessionProvider.')
  }

  return context
}
