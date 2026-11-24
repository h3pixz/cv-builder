const GROUPS = [0, 1, 2];
const COLUMNS = 3;

export function CvSkillsSkeleton() {
  return (
    <div className="max-w-5xl space-y-8" aria-busy="true">
      <span className="sr-only">Loading skills</span>

      {GROUPS.map((group) => (
        <div key={group} className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: COLUMNS * 2 }, (_, index) => (
              <div
                key={index}
                className="h-4 w-full animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
