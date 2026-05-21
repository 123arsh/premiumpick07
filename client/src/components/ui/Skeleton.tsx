export function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-surface-card shadow-card">
      <div className="aspect-square shimmer-bg animate-shimmer bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
