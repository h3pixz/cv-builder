import { Suspense } from "react";

import type { GetUsersQuery } from "@/shared/api/graphql/generated/graphql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { getCurrentUserRole } from "../api/profile.queries";
import {
  getDepartmentOptions,
  getPositionOptions,
  getUsers,
} from "../api/users.queries";
import type { UserRecord } from "../model/user-record";
import { UsersHeader } from "./users-header";
import { UsersPagination } from "./users-pagination";
import { UsersTable } from "./users-table";
import { UsersToolbar } from "./users-toolbar";

const PAGE_SIZE = 50;

const SORT_COLUMNS = new Set([
  "first_name",
  "last_name",
  "department",
  "position",
]);

type ApiUser = GetUsersQuery["users"]["items"][number];

type UsersPageProps = {
  search?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
};

function toOptions(items: { id: string; name: string }[]) {
  return items.map((item) => ({ value: item.id, label: item.name }));
}

function mapUser(user: ApiUser): UserRecord {
  return {
    id: user.id,
    firstName: user.profile.first_name ?? "",
    lastName: user.profile.last_name ?? "",
    email: user.email,
    department: user.department?.name ?? "",
    departmentId: user.department?.id ?? "",
    position: user.position?.name ?? "",
    positionId: user.position?.id ?? "",
    role: user.role,
    avatarUrl: user.profile.avatar ?? undefined,
  };
}

function parsePage(value?: string): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseSortBy(value?: string): string | undefined {
  return value && SORT_COLUMNS.has(value) ? value : undefined;
}

function parseSortOrder(value?: string): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

async function UsersToolbarSection({ search }: { search?: string }) {
  const role = await getCurrentUserRole();
  const canManage = role === "Admin";

  const [departments, positions] = canManage
    ? await Promise.all([getDepartmentOptions(), getPositionOptions()])
    : [[], []];

  return (
    <UsersToolbar
      initialSearch={search ?? ""}
      canManage={canManage}
      departments={toOptions(departments)}
      positions={toOptions(positions)}
    />
  );
}

async function UsersList({
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
  const role = await getCurrentUserRole();
  const canManage = role === "Admin";

  const [result, departments, positions] = await Promise.all([
    getUsers({
      page: parsePage(page),
      limit: PAGE_SIZE,
      search: search?.trim() || undefined,
      sort_by: parseSortBy(sortBy),
      sort_order: parseSortOrder(sortOrder),
    }),
    canManage ? getDepartmentOptions() : Promise.resolve([]),
    canManage ? getPositionOptions() : Promise.resolve([]),
  ]);

  return (
    <>
      <UsersTable
        users={result.items.map(mapUser)}
        canManage={canManage}
        departments={toOptions(departments)}
        positions={toOptions(positions)}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />

      <UsersPagination
        page={result.page}
        totalPages={result.total_pages}
        search={search?.trim() || undefined}
        sortBy={parseSortBy(sortBy)}
        sortOrder={parseSortOrder(sortOrder)}
      />
    </>
  );
}

function UsersTableFallback() {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-225 table-fixed">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            {[
              "",
              "First Name",
              "Last Name",
              "Email",
              "Department",
              "Position",
              "",
            ].map((label, index) => (
              <TableHead
                key={`${label}-${index}`}
                className="px-3 text-xs font-semibold text-foreground"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={7}
              aria-busy="true"
              className="h-24 text-center text-sm text-muted-foreground"
            >
              Loading users...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function UsersPage({ search, page, sortBy, sortOrder }: UsersPageProps) {
  return (
    <section className="w-full space-y-3">
      <UsersHeader />

      <Suspense fallback={<div className="h-10" />}>
        <UsersToolbarSection search={search} />
      </Suspense>

      <Suspense
        key={`${search ?? ""}|${page ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<UsersTableFallback />}
      >
        <UsersList
          search={search}
          page={page ?? "1"}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
