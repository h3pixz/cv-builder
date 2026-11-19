"use server";

import { z } from "zod";

import {
  type ActionResult,
  forbiddenFailure,
  getCurrentUser,
  runAuthed,
} from "@/shared/api";

import {
  addLanguageSchema,
  addSkillSchema,
  updateLanguageSchema,
  updateSkillSchema,
} from "../model/level-forms";
import { getProfilePermissions } from "../model/profile-permissions";
import {
  addUserLanguage,
  addUserSkill,
  deleteUserLanguage,
  deleteUserSkill,
  updateUserLanguage,
  updateUserSkill,
} from "./profile.mutations";
import { getUserLanguages, getUserSkills } from "./profile.queries";
import { revalidateUser } from "./profile-revalidate";

type SkillValues = z.infer<typeof addSkillSchema>;
type UpdateSkillValues = z.infer<typeof updateSkillSchema>;
type LanguageValues = z.infer<typeof addLanguageSchema>;
type UpdateLanguageValues = z.infer<typeof updateLanguageSchema>;

const deleteSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one item");

function invalid(message: string | undefined): ActionResult {
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
): Promise<ActionResult> {
  const parsed = addSkillSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    addUserSkill(
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
): Promise<ActionResult> {
  const parsed = updateSkillSchema.safeParse(values);

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
    return updateUserSkill(
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
): Promise<ActionResult> {
  const parsed = deleteSchema.safeParse(names);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteUserSkill({ userId, name: parsed.data }, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true };
}

// -----------------------------------------------------
// LANGUAGES
// -----------------------------------------------------

export async function addLanguageAction(
  userId: string,
  values: LanguageValues,
): Promise<ActionResult> {
  const parsed = addLanguageSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    addUserLanguage(
      {
        userId,
        name: data.name,
        proficiency: data.mastery,
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

export async function updateLanguageAction(
  userId: string,
  values: UpdateLanguageValues,
): Promise<ActionResult> {
  const parsed = updateLanguageSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    // The backend requires the whole language, not just the new level.
    const languages = await getUserLanguages(userId, { accessToken });
    const existing = languages.find(
      (language) => language.name === data.name,
    );

    if (!existing) {
      throw new Error("Language not found");
    }

    return updateUserLanguage(
      {
        userId,
        name: data.name,
        proficiency: data.mastery,
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

export async function deleteLanguagesAction(
  userId: string,
  names: string[],
): Promise<ActionResult> {
  const parsed = deleteSchema.safeParse(names);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManageProfile(userId))) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteUserLanguage({ userId, name: parsed.data }, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateUser(userId);

  return { success: true };
}
