import { Suspense } from "react";
import { LanguagesManagerSkeleton, LanguagesPage } from "@/features/languages";

export default function Page() {
  return (
    <Suspense fallback={<LanguagesManagerSkeleton />}>
      <LanguagesPage />
    </Suspense>
  );
}
