import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/users/api/profile.queries";
import { getSession } from "@/shared/api";
import { Sidebar } from "@/widgets/sidebar";

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}

async function SidebarWithRole() {
  const me = await getCurrentUser();

  return <Sidebar isAdmin={me.role === "Admin"} />;
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<Sidebar />}>
        <SidebarWithRole />
      </Suspense>
      <main className="flex-1 p-6">
        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground">Loading...</div>
          }
        >
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </main>
    </div>
  );
}
