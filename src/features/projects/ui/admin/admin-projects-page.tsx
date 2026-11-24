import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSkillOptions } from "@/features/skills";

import { getCurrentUser } from "../../api/current-user";
import { getProjectsCatalog } from "../../api/projects.queries";
import { canManageProjectCatalog } from "../../model/project-permissions";
import type { ProjectRecord } from "../../model/project-record";
import { AdminProjectsHeader } from "./admin-projects-header";
import { AdminProjectsPagination } from "./admin-projects-pagination";
import { AdminProjectsTable } from "./admin-projects-table";
import { AdminProjectsTableSkeleton } from "./admin-projects-table-skeleton";

const PAGE_SIZE = 10;

type CatalogItem = Awaited<ReturnType<typeof getProjectsCatalog>>["items"][number];

type SortBy = "name" | "start_date" | "end_date";

type AdminProjectsPageProps = {
  search?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
};

function parsePage(value?: string): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseSortBy(value?: string): SortBy | undefined {
  return value === "name" || value === "start_date" || value === "end_date"
    ? value
    : undefined;
}

function parseSortOrder(value?: string): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

function mapProject(project: CatalogItem): ProjectRecord {
  return {
    id: project.id,
    name: project.name,
    domain: project.domain,
    startDate: project.start_date,
    endDate: project.end_date ?? null,
    description: project.description,
    environment: project.environment,
  };
}

async function ProjectsList({
  search,
  page,
  sortBy,
  sortOrder,
  environmentOptions,
}: {
  search?: string;
  page: string;
  sortBy?: string;
  sortOrder?: string;
  environmentOptions: { value: string; label: string }[];
}) {
  const result = await getProjectsCatalog({
    page: parsePage(page),
    limit: PAGE_SIZE,
    search: search?.trim() || undefined,
    sort_by: parseSortBy(sortBy),
    sort_order: parseSortOrder(sortOrder),
  });

  return (
    <>
      <AdminProjectsTable
        projects={result.items.map(mapProject)}
        environmentOptions={environmentOptions}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <AdminProjectsPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

export async function AdminProjectsPage({
  search,
  page,
  sortBy,
  sortOrder,
}: AdminProjectsPageProps) {
  const me = await getCurrentUser();

  if (!canManageProjectCatalog(me.role)) {
    notFound();
  }

  const skills = await getSkillOptions();
  const environmentOptions = skills.map((skill) => ({
    value: skill.name,
    label: skill.name,
  }));

  const normalizedSearch = search?.trim() || "";

  return (
    <section className="w-full space-y-3">
      <AdminProjectsHeader
        initialSearch={normalizedSearch}
        environmentOptions={environmentOptions}
      />

      <Suspense
        key={`${normalizedSearch}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<AdminProjectsTableSkeleton />}
      >
        <ProjectsList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
          environmentOptions={environmentOptions}
        />
      </Suspense>
    </section>
  );
}
