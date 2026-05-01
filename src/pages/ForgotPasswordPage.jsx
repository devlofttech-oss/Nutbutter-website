import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthField, AuthNotice, AuthPageShell } from './LoginPage.jsx'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function ForgotPasswordPage() {
  const { resetPassword, isSupabaseConfigured } = useAuthSession()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      await resetPassword(email)
      setMessage('Password reset link sent. Please check your email.')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell title="Reset Password" subtitle="We will email you a secure reset link.">
      {!isSupabaseConfigured && <AuthNotice message="Supabase env variables are missing. Add them before using authentication." />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField label="Email Address" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        {formError && <p className="text-sm text-error">{formError}</p>}
        {message && <AuthNotice message={message} />}
        <button className="w-full bg-primary text-on-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary-container transition-all disabled:opacity-60" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-center text-sm text-on-surface-variant">
        Remembered it? <Link className="text-primary hover:text-primary-container" to="/login">Sign in</Link>
      </p>
    </AuthPageShell>
  )
}

