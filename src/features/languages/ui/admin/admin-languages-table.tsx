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

import type { LanguageRecord } from "../../model/language-record";
import { LanguageActionsMenu } from "./language-actions-menu";

type SortOrder = "asc" | "desc";

function SortableHead({
  label,
  column,
  sortBy,
  sortOrder,
  className,
}: {
  label: string;
  column: "name" | "iso2";
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

type AdminLanguagesTableProps = {
  languages: LanguageRecord[];
  sortBy?: string;
  sortOrder?: string;
};

export function AdminLanguagesTable({
  languages,
  sortBy,
  sortOrder,
}: AdminLanguagesTableProps) {
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
              className="w-2/5 px-3"
            />
            <SortableHead
              label="ISO"
              column="iso2"
              sortBy={sortBy}
              sortOrder={sortOrder}
              className="w-1/4 px-3"
            />
            <TableHead className="w-1/4 px-3 text-xs font-semibold text-foreground">
              Native Name
            </TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {languages.length > 0 ? (
            languages.map((language) => (
              <TableRow
                key={language.id}
                className="h-12 border-b border-border transition-colors hover:bg-muted/40"
              >
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {language.name}
                </TableCell>
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {language.iso2}
                </TableCell>
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {language.nativeName}
                </TableCell>
                <TableCell className="px-2 text-right">
                  <LanguageActionsMenu language={language} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No languages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
