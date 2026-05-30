import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import { fetchMyProfile } from '../api/accountApi.js'
import { useAuthSession } from '../providers/AuthSessionProvider.jsx'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthSession()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetchMyProfile(user?.id)
      .then((data) => {
        if (!isMounted) return
        setProfile(data)
        setError('')
      })
      .catch((profileError) => {
        if (!isMounted) return
        setProfile(null)
        setError(profileError.message)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [user?.id])

  const account = useMemo(() => {
    const metadata = user?.user_metadata ?? {}
    const fullName = profile?.full_name || metadata.full_name || metadata.name || 'Satvegik Customer'
    const email = user?.email || 'Not available'
    const phone = profile?.phone || metadata.phone || metadata.phone_number || 'Not added yet'

    return { fullName, email, phone }
  }, [profile, user])

  const initials = account.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const handleLogout = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate('/login', { replace: true })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-10 md:py-xl">
        <section className="mb-7 md:mb-lg">
          <nav className="flex items-center gap-2 mb-sm text-[11px] md:text-xs text-secondary uppercase tracking-[0.12em] md:tracking-widest">
            <Link className="hover:text-primary transition-colors font-serif" to="/">Home</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary font-semibold font-serif">My Account</span>
          </nav>
          <h1 className="font-serif text-[34px] md:text-headline-xl leading-tight text-primary mb-sm">My Account</h1>
          <p className="font-serif text-base md:text-body-lg leading-7 text-on-surface-variant max-w-2xl italic">
            A quiet corner for your Satvegik pantry trail.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          <article className="rounded-[22px] md:rounded-[28px] border border-outline-variant bg-surface-container-low p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(140,115,85,0.08)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6 border-b border-outline-variant pb-6 md:pb-8">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary text-on-primary flex items-center justify-center font-serif text-[30px] md:text-[36px] shadow-[0_16px_34px_rgba(75,54,33,0.18)]">
                {initials || 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary mb-2">Signed in as</p>
                <h2 className="font-serif text-[30px] md:text-[44px] leading-tight text-primary break-words">{account.fullName}</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-5 mt-6 md:mt-8">
              <AccountDetail icon="mail" label="Email" value={account.email} />
              <AccountDetail icon="call" label="Phone" value={account.phone} />
            </div>

            {isLoading && (
              <p className="mt-6 rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface-variant">
                Loading account details...
              </p>
            )}
            {!isLoading && error && (
              <p className="mt-6 rounded-lg border border-error/40 bg-surface px-4 py-3 text-sm font-semibold text-error">
                Some profile details could not be loaded right now.
              </p>
            )}
          </article>

          <aside className="rounded-[22px] border border-outline-variant bg-white/45 p-5 md:p-6 shadow-[0_16px_38px_rgba(115,91,66,0.05)] space-y-3">
            <Link
              className="flex items-center justify-between gap-4 rounded-full bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition-all hover:bg-primary-container"
              to="/orders"
            >
              <span>My Orders</span>
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </Link>
            <button
              className="w-full flex items-center justify-between gap-4 rounded-full border border-outline-variant px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-all hover:border-primary disabled:opacity-60"
              type="button"
              disabled={isSigningOut}
              onClick={handleLogout}
            >
              <span>{isSigningOut ? 'Signing Out...' : 'Logout'}</span>
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function AccountDetail({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-high/50 p-4 md:p-5">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary mb-3">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-base md:text-body-md font-semibold text-primary-container break-words">{value}</p>
    </div>
  )
}
