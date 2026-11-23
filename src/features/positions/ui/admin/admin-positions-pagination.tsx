import { ListPagination } from "@/shared/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

type PageHrefParams = {
  page: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

export function getPositionsPageHref({
  page,
  search,
  sortBy,
  sortOrder,
}: PageHrefParams) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sortBy) params.set("sort_by", sortBy);
  if (sortOrder) params.set("sort_order", sortOrder);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/admin/positions?${query}` : "/admin/positions";
}

export function AdminPositionsPagination({
  page,
  totalPages,
  search,
  sortBy,
  sortOrder,
}: Props) {
  const getHref = (target: number) =>
    getPositionsPageHref({ page: target, search, sortBy, sortOrder });

  return (
    <ListPagination
      page={page}
      totalPages={totalPages}
      getHref={getHref}
      label="Positions pagination"
    />
  );
}
