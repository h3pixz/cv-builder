export const PROJECT_ROLES = ["Admin", "Employee"] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

/** The global project catalog is managed by Admins only. */
export function canManageProjectCatalog(
  role: ProjectRole | null | undefined,
): boolean {
  return role === "Admin";
}
