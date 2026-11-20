import { Suspense } from "react";
import {
  LanguagesManagerSkeleton,
  UserLanguagesPage,
} from "@/features/languages";

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
    <Suspense fallback={<LanguagesManagerSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
