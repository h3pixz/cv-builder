import { Suspense } from "react";
import { SkillsManagerSkeleton, SkillsPage } from "@/features/skills";

export default function Page() {
  return (
    <Suspense fallback={<SkillsManagerSkeleton />}>
      <SkillsPage />
    </Suspense>
  );
}
