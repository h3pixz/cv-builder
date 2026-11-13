import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/shared/api/session";
import { Sidebar } from "@/widgets/sidebar";

async function AuthGate({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
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
