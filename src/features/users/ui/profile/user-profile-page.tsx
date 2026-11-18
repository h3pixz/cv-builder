import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { formatDate } from "@/shared/helpers";

import { getCurrentUser } from "../../api/profile.queries";
import {
  getDepartmentOptions,
  getPositionOptions,
  getUser,
} from "../../api/users.queries";
import { getProfilePermissions } from "../../model/profile-permissions";
import type { ProfileValues } from "../../model/profile-schema";
import { AvatarUpload } from "./avatar-upload";
import { UserProfileForm } from "./user-profile-form";

function getInitials(firstName: string, lastName: string, email: string) {
  const name = `${firstName} ${lastName}`.trim();

  if (!name) return email.charAt(0).toUpperCase() || "?";

  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function UserProfilePage({ userId }: { userId: string }) {
  const [user, currentUser] = await Promise.all([
    getUser(userId),
    getCurrentUser(),
  ]);

  if (!user) notFound();

  const permissions = getProfilePermissions({
    currentUserId: currentUser.id,
    currentUserRole: currentUser.role,
    targetUserId: userId,
  });

  const [departments, positions] = permissions.canEdit
    ? await Promise.all([getDepartmentOptions(), getPositionOptions()])
    : [[], []];

  const firstName = user.profile.first_name ?? "";
  const lastName = user.profile.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || user.email;
  const initial = getInitials(firstName, lastName, user.email);
  const avatarUrl = user.profile.avatar ?? undefined;

  const values: ProfileValues = {
    firstName,
    lastName,
    departmentId: user.department?.id ?? "",
    positionId: user.position?.id ?? "",
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {permissions.canUploadAvatar ? (
        <AvatarUpload userId={userId} avatarUrl={avatarUrl} initial={initial} />
      ) : (
        <Avatar className="size-24">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
          <AvatarFallback className="bg-muted text-3xl text-muted-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="space-y-1 text-center">
        <h1 className="text-base font-medium">{fullName}</h1>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <p className="text-xs">A member since {formatDate(user.created_at)}</p>
      </div>

      <UserProfileForm
        userId={userId}
        values={values}
        departmentName={user.department?.name ?? ""}
        positionName={user.position?.name ?? ""}
        departments={departments.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        positions={positions.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        canEdit={permissions.canEdit}
        canVerifyEmail={permissions.canVerifyEmail}
        isVerified={user.is_verified}
      />
    </div>
  );
}
