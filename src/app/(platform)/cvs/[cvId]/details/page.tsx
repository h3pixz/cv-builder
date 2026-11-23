import { Suspense } from "react";
import { CvDetailsPage } from "@/features/cvs";

type Params = Promise<{ cvId: string }>;

async function Content({ params }: { params: Params }) {
  const { cvId } = await params;

  return <CvDetailsPage cvId={cvId} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-64" />}>
      <Content params={params} />
    </Suspense>
  );
}
