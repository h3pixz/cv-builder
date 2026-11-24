import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../api/current-user";
import {
  getSkillCategories,
  getSkillsCatalog,
} from "../../api/skills.queries";
import { canManageSkillCatalog } from "../../model/skill-permissions";
import {
  flattenSkillCategories,
  type SkillRecord,
} from "../../model/skill-record";
import { AdminSkillsHeader } from "./admin-skills-header";
import { AdminSkillsPagination } from "./admin-skills-pagination";
import { AdminSkillsTable } from "./admin-skills-table";
import { AdminSkillsTableSkeleton } from "./admin-skills-table-skeleton";
import { AdminSkillsToolbar } from "./admin-skills-toolbar";

const PAGE_SIZE = 10;

type CatalogItem = Awaited<
  ReturnType<typeof getSkillsCatalog>
>["items"][number];

type AdminSkillsPageProps = {
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

function mapSkill(skill: CatalogItem): SkillRecord {
  return {
    id: skill.id,
    name: skill.name,
    categoryId: skill.category.id,
    type: skill.category_parent_name ?? skill.category.name,
    category: skill.category_name ?? skill.category.name,
  };
}

async function SkillsToolbarSection({
  initialSearch,
}: {
  initialSearch: string;
}) {
  const categories = await getSkillCategories();

  return (
    <AdminSkillsToolbar
      initialSearch={initialSearch}
      categories={flattenSkillCategories(categories)}
    />
  );
}

async function SkillsList({
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
  const [result, categories] = await Promise.all([
    getSkillsCatalog({
      page: parsePage(page),
      limit: PAGE_SIZE,
      search: search?.trim() || undefined,
      sort_by: parseSortBy(sortBy),
      sort_order: parseSortOrder(sortOrder),
    }),
    getSkillCategories(),
  ]);

  return (
    <>
      <AdminSkillsTable
        skills={result.items.map(mapSkill)}
        categories={flattenSkillCategories(categories)}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <AdminSkillsPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function AdminSkillsPage({
  search,
  page,
  sortBy,
  sortOrder,
}: AdminSkillsPageProps) {
  const me = await getCurrentUser();

  if (!canManageSkillCatalog(me.role)) {
    notFound();
  }

  const normalizedSearch = search?.trim() || "";

  return (
    <section className="w-full space-y-3">
      <AdminSkillsHeader />

      <Suspense fallback={<div className="h-10" />}>
        <SkillsToolbarSection initialSearch={normalizedSearch} />
      </Suspense>

      <Suspense
        key={`${normalizedSearch}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<AdminSkillsTableSkeleton />}
      >
        <SkillsList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
