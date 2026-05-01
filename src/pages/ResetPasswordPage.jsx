import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthField, AuthNotice, AuthPageShell } from './LoginPage.jsx'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updatePassword, isSupabaseConfigured } = useAuthSession()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      await updatePassword(password)
      setMessage('Password updated. Redirecting you to login...')
      window.setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell title="New Password" subtitle="Choose a fresh password for your account.">
      {!isSupabaseConfigured && <AuthNotice message="Supabase env variables are missing. Add them before using authentication." />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField label="New Password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        {formError && <p className="text-sm text-error">{formError}</p>}
        {message && <AuthNotice message={message} />}
        <button className="w-full bg-primary text-on-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary-container transition-all disabled:opacity-60" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthPageShell>
  )
}
