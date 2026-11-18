export function LevelListSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-4xl space-y-6"
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>

      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="space-y-6">
        {Array.from({ length: 2 }, (_, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-7 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-10">
        <div className="h-9 w-36 animate-pulse rounded-full bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
