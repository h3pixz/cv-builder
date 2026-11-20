import { Suspense } from "react";
import { AdminSkillsPage, AdminSkillsTableSkeleton } from "@/features/skills";

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: string;
}>;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { search, page, sort_by, sort_order } = await searchParams;

  return (
    <AdminSkillsPage
      search={search}
      page={page}
      sortBy={sort_by}
      sortOrder={sort_order}
    />
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-3">
          <div className="h-9" />
          <div className="h-10" />
          <AdminSkillsTableSkeleton />
        </div>
      }
    >
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
