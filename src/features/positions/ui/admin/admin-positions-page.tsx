import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../api/current-user";
import { getPositionsCatalog } from "../../api/positions.queries";
import { canManagePositionCatalog } from "../../model/position-permissions";
import type { PositionRecord } from "../../model/position-record";
import { AdminPositionsHeader } from "./admin-positions-header";
import { AdminPositionsPagination } from "./admin-positions-pagination";
import { AdminPositionsTable } from "./admin-positions-table";
import { AdminPositionsTableSkeleton } from "./admin-positions-table-skeleton";

const PAGE_SIZE = 10;

type CatalogItem = Awaited<
  ReturnType<typeof getPositionsCatalog>
>["items"][number];

type AdminPositionsPageProps = {
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

function mapPosition(position: CatalogItem): PositionRecord {
  return {
    id: position.id,
    name: position.name,
  };
}

async function PositionsList({
  search,
  page,
  sortBy,
  sortOrder,
}: {
  search?: string;
  page: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const result = await getPositionsCatalog({
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: search?.trim() || undefined,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  return (
    <>
      <AdminPositionsTable
        positions={result.items.map(mapPosition)}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <AdminPositionsPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function AdminPositionsPage({
  search,
  page,
  sortBy,
  sortOrder,
}: AdminPositionsPageProps) {
  const me = await getCurrentUser();

  // Non-admins must not have access to the catalog page.
  if (!canManagePositionCatalog(me.role)) {
    notFound();
  }

  const normalizedSearch = search?.trim() || "";

  return (
    <section className="w-full space-y-3">
      <AdminPositionsHeader initialSearch={normalizedSearch} />

      <Suspense
        key={`${normalizedSearch}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<AdminPositionsTableSkeleton />}
      >
        <PositionsList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
