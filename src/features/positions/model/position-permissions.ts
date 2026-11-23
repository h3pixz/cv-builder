export const POSITION_ROLES = ["Admin", "Employee"] as const;

export type PositionRole = (typeof POSITION_ROLES)[number];

/** The global position catalog is managed by Admins only. */
export function canManagePositionCatalog(
  role: PositionRole | null | undefined,
): boolean {
  return role === "Admin";
}
