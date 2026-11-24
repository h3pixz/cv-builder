import { ListPagination } from "@/shared/ui/pagination";

type PageHrefParams = {
  basePath: string;
  page: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

export function getCvsPageHref({
  basePath,
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
  return query ? `${basePath}?${query}` : basePath;
}

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

export function CvsPagination({
  basePath,
  page,
  totalPages,
  search,
  sortBy,
  sortOrder,
}: Props) {
  const getHref = (target: number) =>
    getCvsPageHref({
      basePath,
      page: target,
      search,
      sortBy,
      sortOrder,
    });

  return (
    <ListPagination
      page={page}
      totalPages={totalPages}
      getHref={getHref}
      label="CVs pagination"
    />
  );
}
