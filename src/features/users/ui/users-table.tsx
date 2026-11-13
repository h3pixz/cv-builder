"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  avatarUrl?: string;
};

type UsersTableProps = {
  users: UserRecord[];
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

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-225 table-fixed">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            <TableHead className="w-14 px-3" />
            <TableHead className="w-33.75 px-3 text-xs font-semibold text-foreground">
              First Name
            </TableHead>
            <TableHead className="w-33.75 px-3 text-xs font-semibold text-foreground">
              Last Name
            </TableHead>
            <TableHead className="w-57.5 px-3 text-xs font-semibold text-foreground">
              Email
            </TableHead>
            <TableHead className="w-35 px-3 text-xs font-semibold text-foreground">
              Department
            </TableHead>
            <TableHead className="px-3 text-xs font-semibold text-foreground">
              Position
            </TableHead>
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

                    <DropdownMenuContent align="end" className="min-w-24">
                      <DropdownMenuItem
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/users/${user.id}/edit`)}
                      >
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          // TODO: call a Server Action (e.g. deleteUserAction(user.id)),
                          // then router.refresh()
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
