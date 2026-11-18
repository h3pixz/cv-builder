import { Suspense } from "react";
import { UsersPage } from "@/features/users";

type SearchParams = Promise<{
  search?: string;
  page?: string;
  sort_by?: string;
  sort_order?: string;
}>;

async function UsersContent({ searchParams }: { searchParams: SearchParams }) {
  const { search, page, sort_by, sort_order } = await searchParams;

  return (
    <UsersPage
      search={search}
      page={page}
      sortBy={sort_by}
      sortOrder={sort_order}
    />
  );
}

export default function Users({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<div className="h-24" />}>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}
