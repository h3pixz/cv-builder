import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../api/current-user";
import { getLanguagesCatalog } from "../../api/languages.queries";
import { canManageLanguageCatalog } from "../../model/language-permissions";
import type { LanguageRecord } from "../../model/language-record";
import { AdminLanguagesHeader } from "./admin-languages-header";
import { AdminLanguagesPagination } from "./admin-languages-pagination";
import { AdminLanguagesTable } from "./admin-languages-table";
import { AdminLanguagesTableSkeleton } from "./admin-languages-table-skeleton";

const PAGE_SIZE = 10;

type CatalogItem = Awaited<
  ReturnType<typeof getLanguagesCatalog>
>["items"][number];

type AdminLanguagesPageProps = {
  search?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
};

function parsePage(value?: string): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseSortBy(value?: string): "name" | "iso2" | undefined {
  return value === "name" || value === "iso2" ? value : undefined;
}

function parseSortOrder(value?: string): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

function mapLanguage(language: CatalogItem): LanguageRecord {
  return {
    id: language.id,
    name: language.name,
    iso2: language.iso2,
    nativeName: language.native_name ?? "",
  };
}

async function LanguagesList({
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
  const result = await getLanguagesCatalog({
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: search?.trim() || undefined,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  return (
    <>
      <AdminLanguagesTable
        languages={result.items.map(mapLanguage)}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <AdminLanguagesPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function AdminLanguagesPage({
  search,
  page,
  sortBy,
  sortOrder,
}: AdminLanguagesPageProps) {
  const me = await getCurrentUser();

  if (!canManageLanguageCatalog(me.role)) {
    notFound();
  }

  const normalizedSearch = search?.trim() || "";

  return (
    <section className="w-full space-y-3">
      <AdminLanguagesHeader initialSearch={normalizedSearch} />

      <Suspense
        key={`${normalizedSearch}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<AdminLanguagesTableSkeleton />}
      >
        <LanguagesList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
