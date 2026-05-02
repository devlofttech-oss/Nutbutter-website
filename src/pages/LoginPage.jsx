import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle, isAuthenticated, isLoading, isSupabaseConfigured } = useAuthSession()
  const [values, setValues] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectTo = location.state?.from?.pathname ?? '/shop'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    try {
      await signIn(values)
      navigate(redirectTo, { replace: true })
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
    <AuthPageShell title="Welcome Back" subtitle="Sign in to continue your pantry ritual.">
      {!isSupabaseConfigured && <AuthNotice message="Supabase env variables are missing. Add them before using authentication." />}
      {isLoading && <AuthNotice message="Restoring your session..." />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthField label="Email Address" name="email" type="email" value={values.email} onChange={handleChange} />
        <AuthField label="Password" name="password" type="password" value={values.password} onChange={handleChange} />
        {formError && <p className="text-sm text-error">{formError}</p>}
        <button className="w-full bg-primary text-on-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:bg-primary-container transition-all disabled:opacity-60" type="submit" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <button className="w-full border border-outline-variant text-primary py-4 rounded-full text-xs font-bold uppercase tracking-[0.18em] hover:border-primary transition-all disabled:opacity-60" type="button" onClick={handleGoogleLogin} disabled={isSubmitting || !isSupabaseConfigured}>
        Continue with Google
      </button>
      <div className="flex justify-between gap-4 text-sm text-on-surface-variant">
        <Link className="hover:text-primary transition-colors" to="/forgot-password">Forgot password?</Link>
        <Link className="hover:text-primary transition-colors" to="/signup">Create account</Link>
      </div>
    </AuthPageShell>
  )
}

export function AuthPageShell({ title, subtitle, children }) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-12 md:py-xl">
        <section className="max-w-xl mx-auto bg-surface-container-low p-6 sm:p-8 lg:p-12 rounded-[22px] md:rounded-[28px] shadow-[0_20px_50px_rgba(140,115,85,0.08)] border border-surface-container-highest/30">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-[34px] md:text-[56px] leading-tight text-primary mb-4">{title}</h1>
            <p className="text-secondary leading-7">{subtitle}</p>
          </div>
          <div className="space-y-6">{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export function AuthField({ label, name, type, value, onChange }) {
  return (
    <label className="space-y-2 block">
      <span className="text-xs font-bold text-primary uppercase tracking-[0.18em] ml-1">{label}</span>
      <input
        className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-tertiary-container transition-colors py-3 px-1 text-base text-on-surface placeholder:text-outline-variant"
        name={name}
        required
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

export function AuthNotice({ message }) {
  return (
    <p className="rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface-variant">
      {message}
    </p>
  )
}
