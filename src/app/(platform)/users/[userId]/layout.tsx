import { Suspense } from "react";
import { UserLayout } from "@/features/users";

type Props = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
};

async function Body({ children, params }: Props) {
  const { userId } = await params;
  return <UserLayout userId={userId}>{children}</UserLayout>;
}

export default function Layout(props: Props) {
  return (
    <Suspense fallback={<div className="h-24" />}>
      <Body {...props} />
    </Suspense>
  );
}
