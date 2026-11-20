"use server";

import { z } from "zod";

import {
  addMySkill,
  addMySkillSchema,
  deleteMySkill,
  getUserSkills,
  updateMySkill,
  updateMySkillSchema,
} from "@/features/skills";
import { getProfilePermissions } from "@/shared/helpers/profile-permissions";

import type { UsersActionResult } from "../model/action-result";
import { getCurrentUser } from "./profile.queries";
import { revalidateUser } from "./profile-revalidate";
import { forbiddenFailure, runAuthed } from "./run-authed";

type SkillValues = z.infer<typeof addMySkillSchema>;
type UpdateSkillValues = z.infer<typeof updateMySkillSchema>;

const deleteSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one item");

function invalid(message: string | undefined): UsersActionResult {
  return {
    success: false,
    error: message ?? "Invalid data",
    code: null,
  };
}

async function canManageProfile(userId: string): Promise<boolean> {
  const me = await getCurrentUser();

  return getProfilePermissions({
    currentUserId: me.id,
    currentUserRole: me.role,
    targetUserId: userId,
  }).canEdit;
}

// -----------------------------------------------------
// SKILLS
// -----------------------------------------------------

export async function addSkillAction(
  userId: string,
  values: SkillValues,
): Promise<UsersActionResult> {
  const parsed = addMySkillSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    addMySkill(
      {
        userId,
        name: data.name,
        categoryId: data.categoryId ?? undefined,
        mastery: data.mastery,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true };
}

export async function updateSkillAction(
  userId: string,
  values: UpdateSkillValues,
): Promise<UsersActionResult> {
  const parsed = updateMySkillSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    const skills = await getUserSkills(userId, { accessToken });
    const existing = skills.find((skill) => skill.name === data.name);

    // The update form does not touch the category, so keep the current one.
    return updateMySkill(
      {
        userId,
        name: data.name,
        categoryId: existing?.categoryId ?? undefined,
        mastery: data.mastery,
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

export async function deleteSkillsAction(
  userId: string,
  names: string[],
): Promise<UsersActionResult> {
  const parsed = deleteSchema.safeParse(names);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteMySkill({ userId, name: parsed.data }, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true };
}
