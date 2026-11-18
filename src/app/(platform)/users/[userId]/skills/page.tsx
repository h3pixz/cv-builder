import { Suspense } from "react";
import { LevelListSkeleton, UserSkillsPage } from "@/features/users";

async function Content({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserSkillsPage userId={userId} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <Suspense fallback={<LevelListSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
