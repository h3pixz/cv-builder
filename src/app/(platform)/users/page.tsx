import { Suspense } from "react";
import { UsersPage } from "@/features/users";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function UsersContent({ searchParams }: { searchParams: SearchParams }) {
  const { search } = await searchParams;
  return <UsersPage search={search} />;
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
