import { Suspense } from "react";
import { UserBreadcrumbs } from "./user-breadcrumbs";
import { UserTabs } from "./user-tabs";

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

      <UserTabs userId={userId} />

      <div className="pt-6">{children}</div>
    </section>
  );
}
