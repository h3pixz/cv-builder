import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/features/users";
import { getCurrentUser, getSession } from "@/shared/api";
import { Sidebar } from "@/widgets/sidebar";

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}

async function SidebarWithRole() {
  const me = await getCurrentUser();

  if (!me.id) {
    return <Sidebar />;
  }

  const profile = await getCurrentProfile();

  return (
    <Sidebar
      isAdmin={me.role === "Admin"}
      user={{
        id: me.id,
        fullName: profile.full_name ?? profile.email ?? "",
        avatar: profile.avatar,
      }}
    />
  );
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
