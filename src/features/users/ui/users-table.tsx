"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react";

import type { UserRecord } from "../model/user-record";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { SelectOption } from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UpdateUserDialog } from "./update-user-dialog";

type SortOrder = "asc" | "desc";

type SortColumn = "first_name" | "last_name" | "department" | "position";

type UsersTableProps = {
  users: UserRecord[];
  canManage: boolean;
  departments: SelectOption[];
  positions: SelectOption[];
  sortBy?: string;
  sortOrder?: string;
};

function getInitials(firstName: string, lastName: string, email: string) {
  const name = `${firstName} ${lastName}`.trim();

  if (!name) return email.charAt(0).toUpperCase();

  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SortableHead({
  column,
  label,
  sortBy,
  sortOrder,
  className,
}: {
  column: SortColumn;
  label: string;
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

    params.set("sort_by", column);
    if (order === undefined) {
      params.set("sort_order", "asc");
    } else if (order === "asc") {
      params.set("sort_order", "desc");
    } else {
      params.delete("sort_by");
      params.delete("sort_order");
    }
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
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

export function UsersTable({
  users,
  canManage,
  departments,
  positions,
  sortBy,
  sortOrder,
}: UsersTableProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function openUpdate(user: UserRecord) {
    setSelectedUser(user);
    setUpdateOpen(true);
  }

  function openDelete(user: UserRecord) {
    setSelectedUser(user);
    setDeleteOpen(true);
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-225 table-fixed">
          <TableHeader>
            <TableRow className="h-11 border-b border-border hover:bg-transparent">
              <TableHead className="w-14 px-3" />
              <SortableHead
                column="first_name"
                label="First Name"
                sortBy={sortBy}
                sortOrder={sortOrder}
                className="w-33.75 px-3"
              />
              <SortableHead
                column="last_name"
                label="Last Name"
                sortBy={sortBy}
                sortOrder={sortOrder}
                className="w-33.75 px-3"
              />
              <TableHead className="w-57.5 px-3 text-xs font-semibold text-foreground">
                Email
              </TableHead>
              <SortableHead
                column="department"
                label="Department"
                sortBy={sortBy}
                sortOrder={sortOrder}
                className="w-35 px-3"
              />
              <SortableHead
                column="position"
                label="Position"
                sortBy={sortBy}
                sortOrder={sortOrder}
                className="px-3"
              />
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="h-13 border-b border-border transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-3 py-2">
                    <Avatar className="size-7.5">
                      {user.avatarUrl && (
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      )}
                      <AvatarFallback className="bg-disabled text-xs font-medium text-disabled-foreground">
                        {getInitials(user.firstName, user.lastName, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="truncate px-3 text-xs text-foreground">
                    {user.firstName}
                  </TableCell>
                  <TableCell className="truncate px-3 text-xs text-foreground">
                    {user.lastName}
                  </TableCell>
                  <TableCell className="truncate px-3 text-xs text-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="truncate px-3 text-xs text-foreground">
                    {user.department}
                  </TableCell>
                  <TableCell className="truncate px-3 text-xs text-foreground">
                    {user.position}
                  </TableCell>

                  <TableCell className="px-2 text-right">
                    {canManage ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="icon"
                              aria-label={`Actions for ${user.firstName || user.email}`}
                              className="size-8"
                            />
                          }
                        >
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-auto min-w-32"
                        >
                          <DropdownMenuItem
                            onClick={() => router.push(`/users/${user.id}`)}
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUpdate(user)}>
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDelete(user)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="icon"
                        aria-label={`Open ${user.firstName || user.email}`}
                        className="size-8"
                        nativeButton={false}
                        render={<Link href={`/users/${user.id}`} />}
                      >
                        <ArrowRight className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UpdateUserDialog
        user={selectedUser}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        departments={departments}
        positions={positions}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
