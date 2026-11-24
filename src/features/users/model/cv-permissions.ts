import type { UserRoleValue } from "@/shared/types/user-role";

export function canManageCvs(role: UserRoleValue | null | undefined): boolean {
  return role === "Admin";
}
