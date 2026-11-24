import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return range(1, totalPages);
  if (page <= 4) return [...range(1, 5), "end-ellipsis", totalPages];
  if (page >= totalPages - 3) {
    return [1, "start-ellipsis", ...range(totalPages - 4, totalPages)];
  }
  return [
    1,
    "start-ellipsis",
    page - 1,
    page,
    page + 1,
    "end-ellipsis",
    totalPages,
  ];
}

type ListPaginationProps = {
  page: number;
  totalPages: number;
  getHref: (page: number) => string;
  label?: string;
  className?: string;
};

export function ListPagination({
  page,
  totalPages,
  getHref,
  label = "Pagination",
  className,
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const hasPrevious = current > 1;
  const hasNext = current < totalPages;

  return (
    <Pagination aria-label={label} className={cn("pt-4", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getHref(Math.max(1, current - 1))}
            aria-disabled={!hasPrevious}
            tabIndex={hasPrevious ? undefined : -1}
            className={cn(!hasPrevious && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {getPageItems(current, totalPages).map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                href={getHref(item)}
                isActive={item === current}
                aria-label={`Page ${item}`}
                className="size-8 px-0"
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={getHref(Math.min(totalPages, current + 1))}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? undefined : -1}
            className={cn(!hasNext && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
