"use server";

import {
  type ActionResult,
  forbiddenFailure,
  getCurrentUser,
  runAuthed,
} from "@/shared/api";
import { getRequestOrigin } from "@/shared/api/request-origin";

import type { AvatarUploadResult } from "../model/action-result";
import {
  AVATAR_MAX_SIZE,
  AVATAR_SIZE_ERROR,
  AVATAR_TYPE_ERROR,
  isAcceptedAvatarType,
} from "../model/avatar";
import { getProfilePermissions } from "../model/profile-permissions";
import { profileSchema, type ProfileValues } from "../model/profile-schema";
import {
  sendVerificationEmail,
  updateUserProfile,
  uploadUserAvatar,
} from "./profile.mutations";
import { revalidateUser } from "./profile-revalidate";
import { getUser } from "./users.queries";
import { updateUser } from "./users.mutations";

export type UploadAvatarValues = {
  base64: string;
  size: number;
  type: string;
};

export async function updateProfileAction(
  userId: string,
  values: ProfileValues,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile data",
      code: null,
    };
  }

  const me = await getCurrentUser();
  const { canEdit } = getProfilePermissions({
    currentUserId: me.id,
    currentUserRole: me.role,
    targetUserId: userId,
  });

  if (!canEdit) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    const target = await getUser(userId, { accessToken });

    await updateUserProfile(
      {
        userId,
        first_name: data.firstName,
        last_name: data.lastName,
      },
      { accessToken },
    );

    // Department and position live on the user, not the profile. The role is
    // required by the input, so keep the current one.
    await updateUser(
      {
        userId,
        departmentId: data.departmentId,
        positionId: data.positionId,
        role: target.role,
      },
      { accessToken },
    );
  });

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true };
}

export async function uploadAvatarAction(
  userId: string,
  values: UploadAvatarValues,
): Promise<AvatarUploadResult> {
  if (!isAcceptedAvatarType(values.type)) {
    return { success: false, error: AVATAR_TYPE_ERROR, code: null };
  }

  if (values.size <= 0 || values.size > AVATAR_MAX_SIZE) {
    return { success: false, error: AVATAR_SIZE_ERROR, code: null };
  }

  if (!values.base64) {
    return { success: false, error: "Avatar image is required", code: null };
  }

  const me = await getCurrentUser();
  const { canUploadAvatar } = getProfilePermissions({
    currentUserId: me.id,
    currentUserRole: me.role,
    targetUserId: userId,
  });

  if (!canUploadAvatar) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    uploadUserAvatar(
      {
        userId,
        base64: values.base64,
        size: values.size,
        type: values.type,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true, url: result.data };
}

export async function sendVerificationEmailAction(): Promise<ActionResult> {
  const me = await getCurrentUser();
  const email = me.email;

  if (!email) {
    return { success: false, error: "Email is not available", code: null };
  }

  const origin = await getRequestOrigin();
  const result = await runAuthed((accessToken) =>
    sendVerificationEmail(email, { accessToken, origin }),
  );

  if (!result.success) {
    return result;
  }

  return { success: true };
}
