const ROWS = [0, 1, 2];

export function CvProjectsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">Loading projects</span>

      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-full bg-muted" />
        <div className="h-9 w-32 shrink-0 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        {ROWS.map((row) => (
          <div key={row} className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
