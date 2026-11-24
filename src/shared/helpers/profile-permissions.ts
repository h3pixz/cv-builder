import type { UserRoleValue } from "@/shared/types/user-role";

export type ProfilePermissions = {
  canEdit: boolean;
  canUploadAvatar: boolean;
  canVerifyEmail: boolean;
};

type ProfileAccessArgs = {
  currentUserId?: string | null;
  currentUserRole?: UserRoleValue | null;
  targetUserId: string;
};

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
