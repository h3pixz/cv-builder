"use client";

import { Fragment } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { formatDateOnly } from "@/shared/helpers";
import type { SelectOption } from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Tag } from "@/shared/ui/tag";

import type { ProjectRecord } from "../../model/project-record";
import { ProjectActionsMenu } from "./project-actions-menu";

type SortOrder = "asc" | "desc";
type SortColumn = "name" | "start_date" | "end_date";

function SortableHead({
  label,
  column,
  sortBy,
  sortOrder,
  className,
}: {
  label: string;
  column: SortColumn;
  sortBy?: string;
  sortOrder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = sortBy === column;
  const order: SortOrder | undefined = isActive
    ? sortOrder === "desc"
      ? "desc"
      : "asc"
    : undefined;

  function toggleSort() {
    const params = new URLSearchParams(searchParams.toString());

    if (order === undefined) {
      params.set("sort_by", column);
      params.set("sort_order", "asc");
    } else if (order === "asc") {
      params.set("sort_by", column);
      params.set("sort_order", "desc");
    } else {
      params.delete("sort_by");
      params.delete("sort_order");
    }

    params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const SortIcon =
    order === "asc" ? ArrowUp : order === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <TableHead
      aria-sort={
        order === "asc" ? "ascending" : order === "desc" ? "descending" : "none"
      }
      className={className}
    >
      <button
        type="button"
        onClick={toggleSort}
        className="inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        {label}
        <SortIcon
          aria-hidden="true"
          className={order ? "size-3.5 text-primary" : "size-3.5 opacity-50"}
        />
      </button>
    </TableHead>
  );
}

type AdminProjectsTableProps = {
  projects: ProjectRecord[];
  environmentOptions: SelectOption[];
  sortBy?: string;
  sortOrder?: string;
};

export function AdminProjectsTable({
  projects,
  environmentOptions,
  sortBy,
  sortOrder,
}: AdminProjectsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-150 table-fixed text-xs">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            <SortableHead
              label="Name"
              column="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              className="px-3"
            />
            <TableHead className="w-40 px-3 text-xs font-semibold text-foreground">
              Domain
            </TableHead>
            <SortableHead
              label="Start Date"
              column="start_date"
              sortBy={sortBy}
              sortOrder={sortOrder}
              className="w-28 px-3"
            />
            <SortableHead
              label="End Date"
              column="end_date"
              sortBy={sortBy}
              sortOrder={sortOrder}
              className="w-28 px-3"
            />
            <TableHead className="w-14 px-2">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Fragment key={project.id}>
                <TableRow className="border-t border-border border-b-0 first:border-t-0 hover:bg-muted/40">
                  <TableCell className="truncate px-3 py-2 align-top text-xs font-semibold text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell className="truncate px-3 py-2 align-top text-xs text-foreground">
                    {project.domain}
                  </TableCell>
                  <TableCell className="px-3 py-2 align-top text-xs text-foreground">
                    {formatDateOnly(project.startDate) || "—"}
                  </TableCell>
                  <TableCell className="px-3 py-2 align-top text-xs text-foreground">
                    {formatDateOnly(project.endDate) || "—"}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-right align-top">
                    <ProjectActionsMenu
                      project={project}
                      environmentOptions={environmentOptions}
                    />
                  </TableCell>
                </TableRow>

                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="px-3 pt-0 pb-4 align-top whitespace-normal"
                  >
                    <p className="text-xs wrap-break-word text-muted-foreground">
                      {project.description}
                    </p>

                    {project.environment.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {project.environment.map((technology) => (
                          <Tag key={technology} className="wrap-break-word">
                            {technology}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))
          ) : (
            <TableRow className="border-0 hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No projects found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
