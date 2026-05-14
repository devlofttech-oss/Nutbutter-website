import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendPasswordReset, signInWithEmail } from './authApi.js'

const signInWithPassword = vi.fn()
const resetPasswordForEmail = vi.fn()

vi.mock('../lib/supabaseClient.js', () => ({
  requireSupabaseClient: () => ({
    auth: {
      signInWithPassword,
      resetPasswordForEmail,
    },
  }),
}))

vi.mock('../config/env.js', () => ({
  env: { appUrl: 'https://satvegik.test' },
}))

describe('authApi', () => {
  beforeEach(() => {
    signInWithPassword.mockReset()
    resetPasswordForEmail.mockReset()
  })

  it('signs in with email and password', async () => {
    signInWithPassword.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })

    await expect(signInWithEmail({ email: 'a@test.com', password: 'secret' })).resolves.toEqual({ user: { id: 'user-1' } })
    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'a@test.com', password: 'secret' })
  })

  it('uses the branded reset-password route for password reset links', async () => {
    resetPasswordForEmail.mockResolvedValue({ data: {}, error: null })

    await sendPasswordReset('a@test.com')
    expect(resetPasswordForEmail).toHaveBeenCalledWith('a@test.com', {
      redirectTo: 'https://satvegik.test/reset-password',
    })
  })
})
