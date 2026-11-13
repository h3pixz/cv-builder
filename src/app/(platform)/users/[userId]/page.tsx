import { Suspense } from "react";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ userId: string }> };

async function Redirector({ params }: Props): Promise<never> {
  const { userId } = await params;
  redirect(`/users/${userId}/profile`);
}

export default function Page({ params }: Props) {
  return (
    <Suspense>
      <Redirector params={params} />
    </Suspense>
  );
}
