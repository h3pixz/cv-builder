"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { TableHead } from "@/shared/ui/table";

type SortOrder = "asc" | "desc";

export function CvsSortHeader({
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
      className="w-[40%]"
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
