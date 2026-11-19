import { Suspense } from "react";
import { CvsPage } from "@/features/cvs";

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: string;
}>;

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { search, page, sort_by, sort_order } = await searchParams;

  return (
    <CvsPage
      search={search}
      page={page}
      sortBy={sort_by}
      sortOrder={sort_order}
    />
  );
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
