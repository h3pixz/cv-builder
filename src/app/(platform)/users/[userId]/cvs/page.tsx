import { Suspense } from "react";
import { CvsTableSkeleton, UserCvsPage } from "@/features/users";

type Params = Promise<{ userId: string }>;

type SearchParams = Promise<{
  search?: string;
  sort_by?: string;
  sort_order?: string;
}>;

async function Content({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { userId } = await params;
  const { search, sort_by, sort_order } = await searchParams;

  return (
    <UserCvsPage
      userId={userId}
      search={search}
      sortBy={sort_by}
      sortOrder={sort_order}
    />
  );
}

export default function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-10" />
          <CvsTableSkeleton />
        </div>
      }
    >
      <Content params={params} searchParams={searchParams} />
    </Suspense>
  );
}
