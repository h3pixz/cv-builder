export const PROJECT_ROLES = ["Admin", "Employee"] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export function canManageProjectCatalog(
  role: ProjectRole | null | undefined,
): boolean {
  return role === "Admin";
}
