import { getCurrentUser } from "../api/current-user";
import {
  getMySkills,
  getSkillCategories,
  getSkillOptions,
} from "../api/skills.queries";
import { groupSkills, masteryLevel } from "../model/skill-levels";
import { SkillsManager } from "./skills-manager";

export async function SkillsPage() {
  const me = await getCurrentUser();

  if (!me.id) {
    return null;
  }

  const [skills, categories, catalog] = await Promise.all([
    getMySkills(),
    getSkillCategories(),
    getSkillOptions(),
  ]);

  const groups = groupSkills(skills, categories).map((group) => ({
    id: group.id,
    name: group.name,
    items: group.skills.map((skill) => ({
      name: skill.name,
      level: masteryLevel(skill.mastery),
      levelLabel: skill.mastery,
    })),
  }));

  return (
    <SkillsManager
      groups={groups}
      options={catalog.map((skill) => ({
        value: skill.name,
        label: skill.name,
        categoryId: skill.category.id,
      }))}
    />
  );
}
