import { Suspense } from "react";
import { UserCvDetailsPage } from "@/features/users";

type Params = Promise<{ userId: string; cvId: string }>;

async function Content({ params }: { params: Params }) {
  const { userId, cvId } = await params;

  return <UserCvDetailsPage userId={userId} cvId={cvId} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content params={params} />
    </Suspense>
  );
}
