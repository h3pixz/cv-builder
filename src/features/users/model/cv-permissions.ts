import type { UserRoleValue } from "./user-schema";

/** CV management on the User Details page is restricted to Admins. */
export function canManageCvs(role: UserRoleValue | null | undefined): boolean {
  return role === "Admin";
}
