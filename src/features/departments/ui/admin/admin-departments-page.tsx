import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../api/current-user";
import { getDepartmentsCatalog } from "../../api/departments.queries";
import { canManageDepartmentCatalog } from "../../model/department-permissions";
import type { DepartmentRecord } from "../../model/department-record";
import { AdminDepartmentsHeader } from "./admin-departments-header";
import { AdminDepartmentsPagination } from "./admin-departments-pagination";
import { AdminDepartmentsTable } from "./admin-departments-table";
import { AdminDepartmentsTableSkeleton } from "./admin-departments-table-skeleton";

const PAGE_SIZE = 10;

type CatalogItem = Awaited<
  ReturnType<typeof getDepartmentsCatalog>
>["items"][number];

type AdminDepartmentsPageProps = {
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

function mapDepartment(department: CatalogItem): DepartmentRecord {
  return {
    id: department.id,
    name: department.name,
  };
}

async function DepartmentsList({
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
  const result = await getDepartmentsCatalog({
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: search?.trim() || undefined,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  return (
    <>
      <AdminDepartmentsTable
        departments={result.items.map(mapDepartment)}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <AdminDepartmentsPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function AdminDepartmentsPage({
  search,
  page,
  sortBy,
  sortOrder,
}: AdminDepartmentsPageProps) {
  const me = await getCurrentUser();

  // Non-admins must not have access to the catalog page.
  if (!canManageDepartmentCatalog(me.role)) {
    notFound();
  }

  const normalizedSearch = search?.trim() || "";

  return (
    <section className="w-full space-y-3">
      <AdminDepartmentsHeader initialSearch={normalizedSearch} />

      <Suspense
        key={`${normalizedSearch}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<AdminDepartmentsTableSkeleton />}
      >
        <DepartmentsList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
