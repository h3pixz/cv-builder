const FIELDS = ["Name", "Education"];

export function CvDetailsSkeleton() {
  return (
    <div className="max-w-5xl space-y-6" aria-busy="true">
      <span className="sr-only">Loading CV details</span>

      {FIELDS.map((label) => (
        <div key={label} className="space-y-1">
          <span className="block text-[10px] text-muted-foreground">
            {label}
          </span>
          <div className="h-8 animate-pulse rounded bg-muted" />
        </div>
      ))}

      <div className="space-y-1">
        <span className="block text-[10px] text-muted-foreground">
          Description
        </span>
        <div className="h-40 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex justify-end pt-3">
        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
