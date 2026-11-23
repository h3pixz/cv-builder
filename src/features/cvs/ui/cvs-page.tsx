import { Suspense } from "react";

import { getCurrentUser } from "@/shared/api";

import { getCvs } from "../api/cvs.queries";
import { toCvRecord } from "../model/cv-record";
import { CvsHeader } from "./cvs-header";
import { CvsPagination } from "./cvs-pagination";
import { CvsTable } from "./cvs-table";
import { CvsTableSkeleton } from "./cvs-table-skeleton";
import { CvsToolbar } from "./cvs-toolbar";

const PAGE_SIZE = 50;

type Props = {
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

async function CvsToolbarSection({ search }: { search?: string }) {
  const me = await getCurrentUser();

  if (!me.id) {
    return null;
  }

  return (
    <CvsToolbar ownerUserId={me.id} initialSearch={search?.trim() ?? ""} />
  );
}

async function CvsList({ search, page, sortBy, sortOrder }: Props) {
  const me = await getCurrentUser();
  const searchValue = search?.trim() || undefined;

  const result = await getCvs({
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: searchValue,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  const emptyMessage =
    !searchValue && me.role !== "Admin"
      ? "You have no CVs yet"
      : "No CVs found";

  return (
    <>
      <CvsTable
        cvs={result.items.map(toCvRecord)}
        emptyMessage={emptyMessage}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <CvsPagination
        basePath="/cvs"
        page={result.page}
        totalPages={result.total_pages}
        search={searchValue}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export function CvsPage({ search, page, sortBy, sortOrder }: Props) {
  return (
    <section className="w-full space-y-3">
      <CvsHeader />

      <Suspense fallback={<div className="h-10" />}>
        <CvsToolbarSection search={search} />
      </Suspense>

      <Suspense
        key={`${search ?? ""}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<CvsTableSkeleton />}
      >
        <CvsList
          search={search}
          page={page}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
