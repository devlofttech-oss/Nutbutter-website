import { env } from '../config/env.js'
import { requireSupabaseClient } from '../lib/supabaseClient.js'

export async function signUpWithEmail({ email, password, metadata = {} }) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${env.appUrl}/auth/callback`,
    },
  })

  if (error) throw error

  return data
}

export async function signInWithEmail({ email, password }) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw error

  return data
}

export async function signInWithGoogle() {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.appUrl}/auth/callback`,
    },
  })

  if (error) throw error

  return data
}

export async function sendPasswordReset(email) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.appUrl}/reset-password`,
  })

  if (error) throw error

  return data
}

export async function updatePassword(password) {
  const supabase = requireSupabaseClient()
  const { data, error } = await supabase.auth.updateUser({ password })

  if (error) throw error

  return data
}

export async function signOutUser() {
  const supabase = requireSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}
