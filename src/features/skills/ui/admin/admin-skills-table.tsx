"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import type {
  SkillCategoryOption,
  SkillRecord,
} from "../../model/skill-record";
import { SkillActionsMenu } from "./skill-actions-menu";

type SortOrder = "asc" | "desc";

function SortableNameHead({
  sortBy,
  sortOrder,
}: {
  sortBy?: string;
  sortOrder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = sortBy === "name";
  const order: SortOrder | undefined = isActive
    ? sortOrder === "desc"
      ? "desc"
      : "asc"
    : undefined;

  function toggleSort() {
    const params = new URLSearchParams(searchParams.toString());

    if (order === undefined) {
      params.set("sort_by", "name");
      params.set("sort_order", "asc");
    } else if (order === "asc") {
      params.set("sort_by", "name");
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
      className="w-2/5 px-3"
    >
      <button
        type="button"
        onClick={toggleSort}
        className="inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        Name
        <SortIcon
          aria-hidden="true"
          className={order ? "size-3.5 text-primary" : "size-3.5 opacity-50"}
        />
      </button>
    </TableHead>
  );
}

type AdminSkillsTableProps = {
  skills: SkillRecord[];
  categories: SkillCategoryOption[];
  sortBy?: string;
  sortOrder?: string;
};

export function AdminSkillsTable({
  skills,
  categories,
  sortBy,
  sortOrder,
}: AdminSkillsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-150 table-fixed text-xs">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            <SortableNameHead sortBy={sortBy} sortOrder={sortOrder} />
            <TableHead className="w-1/4 px-3 text-xs font-semibold text-foreground">
              Type
            </TableHead>
            <TableHead className="w-1/4 px-3 text-xs font-semibold text-foreground">
              Category
            </TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <TableRow
                key={skill.id}
                className="h-12 border-b border-border transition-colors hover:bg-muted/40"
              >
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {skill.name}
                </TableCell>
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {skill.type}
                </TableCell>
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {skill.category}
                </TableCell>
                <TableCell className="px-2 text-right">
                  <SkillActionsMenu skill={skill} categories={categories} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No skills found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
