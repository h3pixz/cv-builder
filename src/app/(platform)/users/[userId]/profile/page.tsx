import { Suspense } from "react";
import { UserProfilePage, UserProfileSkeleton } from "@/features/users";

async function Content({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserProfilePage userId={userId} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
