import { Suspense } from "react";

import { groupSkills, masteryLevel } from "@/features/skills";

import { getCvContext, getCvSkillCategories } from "../api/cvs.queries";
import { CvSkillsManager } from "./cv-skills-manager";
import { CvSkillsSkeleton } from "./cv-skills-skeleton";

async function CvSkills({ cvId }: { cvId: string }) {
  const [{ cv }, categories] = await Promise.all([
    getCvContext(cvId),
    getCvSkillCategories(),
  ]);

  const groups = groupSkills(cv.skills, categories).map((group) => ({
    id: group.id,
    name: group.name,
    items: group.skills.map((skill) => ({
      name: skill.name,
      level: masteryLevel(skill.mastery),
      levelLabel: skill.mastery,
    })),
  }));

  const options = (cv.user?.profile.skills ?? []).map((skill) => ({
    value: skill.name,
    label: skill.name,
  }));

  return <CvSkillsManager cvId={cv.id} groups={groups} options={options} />;
}

export function CvSkillsPage({ cvId }: { cvId: string }) {
  return (
    <Suspense fallback={<CvSkillsSkeleton />}>
      <CvSkills cvId={cvId} />
    </Suspense>
  );
}
