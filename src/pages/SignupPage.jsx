import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthField, AuthNotice, AuthPageShell } from './LoginPage.jsx'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, isSupabaseConfigured } = useAuthSession()
  const [values, setValues] = useState({ fullName: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const result = await signUp({
        email: values.email,
        password: values.password,
        metadata: { full_name: values.fullName },
      })

      if (result.session) {
        navigate('/shop', { replace: true })
        return
      }

      setMessage('Account created. Please check your email to confirm your signup.')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setFormError('')
    setIsSubmitting(true)

    try {
      await signInWithGoogle()
    } catch (error) {
      setFormError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell title="Create Account" subtitle="Save your cart and checkout faster.">
      {!isSupabaseConfigured && <AuthNotice message="Supabase env variables are missing. Add them before using authentication." />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField label="Full Name" name="fullName" type="text" value={values.fullName} onChange={handleChange} />
        <AuthField label="Email Address" name="email" type="email" value={values.email} onChange={handleChange} />
        <AuthField label="Password" name="password" type="password" value={values.password} onChange={handleChange} />
        {formError && <p className="text-sm text-error">{formError}</p>}
        {message && <AuthNotice message={message} />}
        <button className="w-full bg-primary text-on-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary-container transition-all disabled:opacity-60" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <button className="w-full border border-outline-variant text-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:border-primary transition-all disabled:opacity-60" type="button" onClick={handleGoogleLogin} disabled={isSubmitting || !isSupabaseConfigured}>
        Continue with Google
      </button>
      <p className="text-center text-sm text-on-surface-variant">
        Already have an account? <Link className="text-primary hover:text-primary-container" to="/login">Sign in</Link>
      </p>
    </AuthPageShell>
  )
}

