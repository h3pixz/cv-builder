const MASTERY = [
  "Novice",
  "Advanced",
  "Competent",
  "Proficient",
  "Expert",
] as const;
const PROFICIENCY = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"] as const;

export const MASTERY_MAX = MASTERY.length;
export const PROFICIENCY_MAX = PROFICIENCY.length;

export function masteryLevel(value: string): number {
  return MASTERY.indexOf(value as (typeof MASTERY)[number]) + 1;
}
export function proficiencyLevel(value: string): number {
  return PROFICIENCY.indexOf(value as (typeof PROFICIENCY)[number]) + 1;
}

type CategoryMeta = { id: string; name: string; order: number };
type Category = CategoryMeta & { children: CategoryMeta[] };
type SkillMastery = {
  name: string;
  categoryId?: string | null;
  mastery: string;
};

export type SkillGroup = {
  id: string;
  name: string;
  order: number;
  skills: SkillMastery[];
};

export function groupSkills(
  skills: SkillMastery[],
  categories: Category[],
): SkillGroup[] {
  const known = new Map<string, CategoryMeta>();
  for (const c of categories) {
    known.set(c.id, c);
    for (const child of c.children) known.set(child.id, child);
  }

  const groups = new Map<string, SkillGroup>();
  for (const skill of skills) {
    const id = skill.categoryId ?? "other";
    const meta = known.get(id);
    const group = groups.get(id) ?? {
      id,
      name: meta?.name ?? "Other",
      order: meta?.order ?? Number.MAX_SAFE_INTEGER,
      skills: [],
    };
    group.skills.push(skill);
    groups.set(id, group);
  }

  return [...groups.values()].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name),
  );
}
