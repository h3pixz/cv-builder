import { Suspense } from "react";
import { CvLayout } from "@/features/cvs";

type Props = {
  children: React.ReactNode;
  params: Promise<{ cvId: string }>;
};

async function Body({ children, params }: Props) {
  const { cvId } = await params;
  return <CvLayout cvId={cvId}>{children}</CvLayout>;
}

export default function Layout(props: Props) {
  return (
    <Suspense fallback={<div className="h-24" />}>
      <Body {...props} />
    </Suspense>
  );
}
