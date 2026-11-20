import { Suspense } from "react";
import { redirect } from "next/navigation";

type Params = Promise<{ cvId: string }>;

async function Content({ params }: { params: Params }) {
  const { cvId } = await params;

  redirect(`/cvs/${cvId}/details`);

  return null;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content params={params} />
    </Suspense>
  );
}
