export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="rounded-[28px] border border-outline-variant bg-surface-container-low px-8 py-16 text-center text-on-surface-variant">
      <span className="material-symbols-outlined text-4xl text-primary mb-4 animate-pulse">progress_activity</span>
      <p>{message}</p>
    </div>
  )
}

