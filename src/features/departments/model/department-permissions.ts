export const DEPARTMENT_ROLES = ["Admin", "Employee"] as const;

export type DepartmentRole = (typeof DEPARTMENT_ROLES)[number];

/** The global department catalog is managed by Admins only. */
export function canManageDepartmentCatalog(
  role: DepartmentRole | null | undefined,
): boolean {
  return role === "Admin";
}
