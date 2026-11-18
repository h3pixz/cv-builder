import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSession } from "@/shared/api";

import { getUserCvs } from "../../api/cvs.queries";
import { getCurrentUser } from "../../api/profile.queries";
import { getUser } from "../../api/users.queries";
import { canManageCvs } from "../../model/cv-permissions";
import { CvsTable } from "./cvs-table";
import { CvsTableSkeleton } from "./cvs-table-skeleton";
import { CvsToolbar } from "./cvs-toolbar";

const PAGE_SIZE = 50;

type Props = {
  userId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

function parseSortBy(value?: string): "name" | undefined {
  return value === "name" ? "name" : undefined;
}

function parseSortOrder(value?: string): "asc" | "desc" | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

async function CvsList({ userId, search, sortBy, sortOrder }: Props) {
  const session = await getSession();

  const [cvs, user] = await Promise.all([
    getUserCvs(
      userId,
      {
        page: 1,
        limit: PAGE_SIZE,
        search: search?.trim() || undefined,
        sort_by: parseSortBy(sortBy),
        sort_order: parseSortOrder(sortOrder),
      },
      { accessToken: session?.access_token },
    ),
    getUser(userId),
  ]);

  return (
    <CvsTable
      userId={userId}
      cvs={cvs.items}
      employee={user?.email ?? ""}
      sortBy={parseSortBy(sortBy)}
      sortOrder={parseSortOrder(sortOrder)}
    />
  );
}

export async function UserCvsPage({ userId, search, sortBy, sortOrder }: Props) {
  const me = await getCurrentUser();

  if (!canManageCvs(me.role)) {
    notFound();
  }

  return (
    <section className="w-full space-y-4">
      <Suspense fallback={<div className="h-10" />}>
        <CvsToolbar userId={userId} initialSearch={search ?? ""} />
      </Suspense>

      <Suspense
        key={`${search ?? ""}|${sortBy ?? ""}|${sortOrder ?? ""}`}
        fallback={<CvsTableSkeleton />}
      >
        <CvsList
          userId={userId}
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </section>
  );
}
