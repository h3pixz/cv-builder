import { Suspense } from "react";

import { getSession } from "@/shared/api/session";
import type { GetUsersQuery } from "@/shared/api/graphql/generated/graphql";

import { getUsers } from "../api/users.queries";
import { UsersTable, type UserRecord } from "./users-table";
import { UsersToolbar } from "./users-toolbar";

type ApiUser = GetUsersQuery["users"]["items"][number];

type UsersPageProps = {
  search?: string;
};

function mapUser(user: ApiUser): UserRecord {
  return {
    id: user.id,
    firstName: user.profile.first_name ?? "",
    lastName: user.profile.last_name ?? "",
    email: user.email,
    department: user.department?.name ?? "",
    position: user.position?.name ?? "",
    avatarUrl: user.profile.avatar ?? undefined,
  };
}

// Server component: fetches data on the server and passes plain,
// serializable props to the client table.
async function UsersList({ search }: UsersPageProps) {
  const session = await getSession();

  const result = await getUsers(
    {
      page: 1,
      limit: 50,
      search: search?.trim() || undefined,
    },
    { accessToken: session?.access_token },
  );

  return <UsersTable users={result.items.map(mapUser)} />;
}

export function UsersPage({ search }: UsersPageProps) {
  return (
    <section className="w-full space-y-3">
      <UsersToolbar initialSearch={search ?? ""} />

      {/* key={search} re-shows the fallback every time the search changes */}
      <Suspense
        key={search}
        fallback={
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            Loading users...
          </div>
        }
      >
        <UsersList search={search} />
      </Suspense>
    </section>
  );
}
