import { useState } from 'react'

export default function PopupForm({ onSuccess, onDismiss }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    onSuccess()
  }

  return (
    <form className="w-full max-w-sm space-y-sm" noValidate onSubmit={handleSubmit}>
      <label className="block space-y-xs">
        <span className="sr-only">Email address</span>
        <input
          className={`w-full bg-surface-container-low border rounded-lg px-4 md:px-md py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 text-base text-on-surface placeholder:text-outline font-serif ${
            error ? 'border-error' : 'border-transparent focus:border-secondary'
          }`}
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError('')
          }}
        />
      </label>

      {error && <p className="text-label-sm text-error">{error}</p>}

      <button
        className="w-full bg-primary-container text-on-primary py-4 px-4 md:px-md rounded-lg font-semibold transition-all hover:opacity-90 active:scale-[0.98] uppercase tracking-widest text-label-md"
        type="submit"
      >
        Claim Discount
      </button>

      <button
        className="block w-full text-center text-on-surface-variant text-label-sm font-semibold hover:text-primary hover:underline transition-all"
        type="button"
        onClick={onDismiss}
      >
        No thanks
      </button>
    </form>
  )
}
