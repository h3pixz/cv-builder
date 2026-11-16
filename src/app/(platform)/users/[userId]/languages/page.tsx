import { Suspense } from "react";
import { UserLanguagesPage } from "@/features/users";

async function Content({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserLanguagesPage userId={userId} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content params={params} />
    </Suspense>
  );
}
