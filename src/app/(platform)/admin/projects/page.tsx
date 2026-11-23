import { Suspense } from "react";
import {
  AdminProjectsPage,
  AdminProjectsTableSkeleton,
} from "@/features/projects";

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: string;
}>;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { search, page, sort_by, sort_order } = await searchParams;

  return (
    <AdminProjectsPage
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
          <AdminProjectsTableSkeleton />
        </div>
      }
    >
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
