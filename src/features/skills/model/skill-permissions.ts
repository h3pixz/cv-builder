export const SKILL_ROLES = ["Admin", "Employee"] as const;

export type SkillRole = (typeof SKILL_ROLES)[number];

export function canManageSkillCatalog(
  role: SkillRole | null | undefined,
): boolean {
  return role === "Admin";
}
