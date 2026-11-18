"use server";

import { revalidatePath } from "next/cache";

import type { UsersActionResult } from "../model/action-result";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserValues,
  type UpdateUserValues,
} from "../model/user-schema";
import { updateUserProfile } from "./profile.mutations";
import { runAuthed } from "./run-authed";
import { createUser, deleteUser, updateUser } from "./users.mutations";

function revalidateUsers(userId?: string) {
  revalidatePath("/users");

  if (userId) {
    revalidatePath(`/users/${userId}`, "layout");
  }
}

export async function createUserAction(
  values: CreateUserValues,
): Promise<UsersActionResult> {
  const parsed = createUserSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid user data",
      code: null,
    };
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    createUser(
      {
        auth: { email: data.email, password: data.password },
        profile: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
        departmentId: data.departmentId,
        positionId: data.positionId,
        role: data.role,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidateUsers();

  return { success: true };
}

export async function updateUserAction(
  userId: string,
  values: UpdateUserValues,
): Promise<UsersActionResult> {
  const parsed = updateUserSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid user data",
      code: null,
    };
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    await updateUserProfile(
      {
        userId,
        first_name: data.firstName,
        last_name: data.lastName,
      },
      { accessToken },
    );

    return updateUser(
      {
        userId,
        departmentId: data.departmentId,
        positionId: data.positionId,
        role: data.role,
      },
      { accessToken },
    );
  });

  if (!result.success) {
    return result;
  }

  revalidateUsers(userId);

  return { success: true };
}

export async function deleteUserAction(
  userId: string,
): Promise<UsersActionResult> {
  const result = await runAuthed((accessToken) =>
    deleteUser(userId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateUsers(userId);

  return { success: true };
}
