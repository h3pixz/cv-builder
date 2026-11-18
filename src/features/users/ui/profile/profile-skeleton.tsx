export function UserProfileSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6"
      aria-busy="true"
    >
      <span className="sr-only">Loading profile information...</span>

      <div className="size-24 animate-pulse rounded-full bg-muted" />

      <div className="flex w-full flex-col items-center gap-2">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-56 animate-pulse rounded bg-muted" />
        <div className="h-3 w-44 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-8 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
