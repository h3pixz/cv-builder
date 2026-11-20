function Line({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

export function CvPreviewSkeleton() {
  return (
    <div className="max-w-5xl space-y-14" aria-busy="true">
      <span className="sr-only">Loading CV preview</span>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Line className="h-9 w-72" />
          <Line className="h-3 w-40" />
        </div>
        <Line className="h-9 w-32 rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Line className="h-4 w-32" />
              <Line className="h-4 w-40" />
            </div>
          ))}
        </div>

        <div className="space-y-6 lg:border-l lg:border-border lg:pl-10">
          <Line className="h-5 w-64" />
          {Array.from({ length: 5 }, (_, index) => (
            <Line key={index} className="h-4 w-full" />
          ))}
          <Line className="h-4 w-48" />
          <Line className="h-4 w-56" />
        </div>
      </div>

      <div className="space-y-6">
        <Line className="h-7 w-40" />
        <div className="space-y-3">
          <Line className="h-4 w-52" />
          <Line className="h-4 w-full" />
          <Line className="h-4 w-5/6" />
        </div>
      </div>

      <div className="space-y-6">
        <Line className="h-7 w-56" />
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Line key={index} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
