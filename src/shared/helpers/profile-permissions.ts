import type { UserRoleValue } from "@/shared/types/user-role";

export type ProfilePermissions = {
  /** First/last name, department and position fields can be changed. */
  canEdit: boolean;
  /** The avatar upload control is available. */
  canUploadAvatar: boolean;
  /** The verify email action is available. */
  canVerifyEmail: boolean;
};

type ProfileAccessArgs = {
  currentUserId?: string | null;
  currentUserRole?: UserRoleValue | null;
  targetUserId: string;
};

/**
 * Mirrors the backend guards: `OwnProfileGuard` on updateProfile/uploadAvatar
 * (Admin or the profile owner) and owner-only email verification.
 */
export function getProfilePermissions({
  currentUserId,
  currentUserRole,
  targetUserId,
}: ProfileAccessArgs): ProfilePermissions {
  const isAdmin = currentUserRole === "Admin";
  const isOwner = Boolean(currentUserId) && currentUserId === targetUserId;
  const canManage = isAdmin || isOwner;

  return {
    canEdit: canManage,
    canUploadAvatar: canManage,
    canVerifyEmail: isOwner,
  };
}
