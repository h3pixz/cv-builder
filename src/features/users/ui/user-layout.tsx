import { Suspense } from "react";

import { getCurrentUser } from "../api/profile.queries";
import { canManageCvs } from "../model/cv-permissions";
import { UserBreadcrumbs } from "./user-breadcrumbs";
import { UserTabs } from "./user-tabs";

async function UserTabsSection({ userId }: { userId: string }) {
  const me = await getCurrentUser();

  return <UserTabs userId={userId} showCvs={canManageCvs(me.role)} />;
}

export function UserLayout({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <Suspense fallback={<div className="h-5" />}>
        <UserBreadcrumbs userId={userId} />
      </Suspense>

      <Suspense fallback={<div className="h-10" />}>
        <UserTabsSection userId={userId} />
      </Suspense>

      <div className="pt-6">{children}</div>
    </section>
  );
}
