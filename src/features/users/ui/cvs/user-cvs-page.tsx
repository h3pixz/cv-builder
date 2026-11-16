// features/users/ui/cvs/user-cvs-page.tsx
import { Suspense } from "react";

import { getSession } from "@/shared/api";
import { getUser, getUserCvs } from "../../api/users.queries";
import { CvsTable } from "./cvs-table";
import { CvsToolbar } from "./cvs-toolbar";

type Props = { userId: string; search?: string };

async function CvsList({ userId, search }: Props) {
  const session = await getSession();

  const [cvs, user] = await Promise.all([
    getUserCvs(
      userId,
      { page: 1, limit: 50, search: search?.trim() || undefined },
      { accessToken: session?.access_token },
    ),
    getUser(userId),
  ]);

  return <CvsTable cvs={cvs.items} employee={user?.email ?? ""} />;
}

export function UserCvsPage({ userId, search }: Props) {
  return (
    <section className="space-y-4">
      <Suspense fallback={<div className="h-10" />}>
        <CvsToolbar initialSearch={search ?? ""} />
      </Suspense>

      <Suspense
        key={search}
        fallback={
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            Loading CVs...
          </div>
        }
      >
        <CvsList userId={userId} search={search} />
      </Suspense>
    </section>
  );
}
