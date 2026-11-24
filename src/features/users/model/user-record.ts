import type { UserRoleValue } from "@/shared/types/user-role";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  departmentId: string;
  position: string;
  positionId: string;
  role: UserRoleValue;
  avatarUrl?: string;
};
