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

import type { PositionRecord } from "../../model/position-record";
import { PositionActionsMenu } from "./position-actions-menu";

type SortOrder = "asc" | "desc";

function SortableHead({
  label,
  column,
  sortBy,
  sortOrder,
}: {
  label: string;
  column: "name";
  sortBy?: string;
  sortOrder?: string;
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
      className="px-3"
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

type AdminPositionsTableProps = {
  positions: PositionRecord[];
  sortBy?: string;
  sortOrder?: string;
};

export function AdminPositionsTable({
  positions,
  sortBy,
  sortOrder,
}: AdminPositionsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-100 table-fixed text-xs">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            <SortableHead
              label="Name"
              column="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
            <TableHead className="w-14">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {positions.length > 0 ? (
            positions.map((position) => (
              <TableRow
                key={position.id}
                className="h-12 border-b border-border transition-colors hover:bg-muted/40"
              >
                <TableCell className="truncate px-3 text-xs text-foreground">
                  {position.name}
                </TableCell>
                <TableCell className="px-2 text-right">
                  <PositionActionsMenu position={position} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No positions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
