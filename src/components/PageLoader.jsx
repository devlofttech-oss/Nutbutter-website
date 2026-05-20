export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="rounded-[28px] border border-outline-variant bg-surface-container-low px-8 py-12" role="status" aria-live="polite" aria-label={message}>
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-surface-container-high" aria-hidden="true" />
        <div className="space-y-3" aria-hidden="true">
          <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-surface-container-high" />
          <div className="mx-auto h-3 w-full max-w-md animate-pulse rounded-full bg-surface-container-high" />
          <div className="mx-auto h-3 w-4/5 max-w-sm animate-pulse rounded-full bg-surface-container-high" />
        </div>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  )
}
