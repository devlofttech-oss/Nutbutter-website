function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-surface-container-high ${className}`} aria-hidden="true" />
}

export function ProductGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card rounded-[22px] border border-outline-variant bg-white p-4 shadow-[0_18px_45px_rgba(115,91,66,0.06)]">
          <SkeletonBlock className="aspect-[4/5] w-full rounded-[18px]" />
          <div className="space-y-3 pt-5">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-5/6" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start" aria-label="Loading product">
      <SkeletonBlock className="aspect-[4/5] w-full rounded-[22px] md:rounded-[28px]" />
      <div className="space-y-6 md:space-y-8">
        <SkeletonBlock className="h-3 w-48" />
        <SkeletonBlock className="h-12 w-4/5 md:h-16" />
        <SkeletonBlock className="h-7 w-32" />
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-28" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-12 w-24 rounded-full" />
            <SkeletonBlock className="h-12 w-24 rounded-full" />
          </div>
        </div>
        <SkeletonBlock className="h-14 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-10 rounded-full" />
          <SkeletonBlock className="h-10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 md:px-12 py-10 md:py-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-12 w-4/5 max-w-2xl md:h-16" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  )
}
