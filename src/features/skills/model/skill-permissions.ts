export const SKILL_ROLES = ["Admin", "Employee"] as const;

export type SkillRole = (typeof SKILL_ROLES)[number];

/** The global skills catalog is managed by Admins only. */
export function canManageSkillCatalog(
  role: SkillRole | null | undefined,
): boolean {
  return role === "Admin";
}
