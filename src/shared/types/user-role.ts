export const USER_ROLES = ["Admin", "Employee"] as const;

export type UserRoleValue = (typeof USER_ROLES)[number];
