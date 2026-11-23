import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/shared/api";

import { getCvsByUserId } from "../api/cvs.queries";
import { toCvRecord } from "../model/cv-record";
import { CvsPagination } from "./cvs-pagination";
import { CvsTable } from "./cvs-table";
import { CvsTableSkeleton } from "./cvs-table-skeleton";
import { CvsToolbar } from "./cvs-toolbar";

const PAGE_SIZE = 50;

type Props = {
  userId: string;
  search?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
};

function parsePage(value?: string): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseSortBy(value?: string): "name" | undefined {
  return value === "name" ? "name" : undefined;
}

function parseSortOrder(value?: string): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

async function UserCvsList({ userId, search, page, sortBy, sortOrder }: Props) {
  const searchValue = search?.trim() || undefined;

  const result = await getCvsByUserId(userId, {
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: searchValue,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  return (
    <>
      <CvsTable
        cvs={result.items.map(toCvRecord)}
        emptyMessage={searchValue ? "No CVs found" : "You have no CVs yet"}
        showEmployee={false}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <CvsPagination
        basePath={`/users/${userId}/cvs`}
        page={result.page}
        totalPages={result.total_pages}
        search={searchValue}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function UserCvsPage({
  userId,
  search,
  page,
  sortBy,
  sortOrder,
}: Props) {
  const me = await getCurrentUser();

  if (me.role !== "Admin") {
    notFound();
  }

  return (
    <section className="w-full space-y-4">
      <Suspense fallback={<div className="h-10" />}>
        <CvsToolbar ownerUserId={userId} initialSearch={search?.trim() ?? ""} />
      </Suspense>

      <Suspense
        key={`${search ?? ""}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<CvsTableSkeleton />}
      >
        <UserCvsList
          userId={userId}
          search={search}
          page={page}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
