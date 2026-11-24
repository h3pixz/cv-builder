export const DEPARTMENT_ROLES = ["Admin", "Employee"] as const;

export type DepartmentRole = (typeof DEPARTMENT_ROLES)[number];

export function canManageDepartmentCatalog(
  role: DepartmentRole | null | undefined,
): boolean {
  return role === "Admin";
}
