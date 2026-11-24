"use server";

import { z } from "zod";

import { getProfilePermissions } from "@/shared/helpers/profile-permissions";

import type { LanguagesActionResult } from "../model/action-result";
import {
  LANGUAGE_MESSAGES,
  addMyLanguageSchema,
  updateMyLanguageSchema,
  type AddMyLanguageValues,
  type UpdateMyLanguageValues,
} from "../model/language-schema";
import { getCurrentUser } from "./current-user";
import {
  addMyLanguage,
  deleteMyLanguage,
  updateMyLanguage,
} from "./profile-languages.mutations";
import { runAuthed, unauthorizedFailure, forbiddenFailure } from "./run-authed";
import { getUserLanguagesWithToken } from "./languages.queries";
import { revalidateLanguages } from "./languages-revalidate";

type Field = NonNullable<
  Extract<LanguagesActionResult, { success: false }>["field"]
>;

const deleteNamesSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one language");

function invalid(
  message: string | undefined,
  field?: Field,
): LanguagesActionResult {
  return {
    success: false,
    error: message ?? "Invalid language data",
    code: null,
    field,
  };
}

function fieldFromPath(path?: PropertyKey[]): Field | undefined {
  const key = path?.[0];

  return key === "name" || key === "mastery" ? key : undefined;
}

function normalizeDuplicate(
  result: LanguagesActionResult,
): LanguagesActionResult {
  if (!result.success && result.code === "languageHasBeenAdded") {
    return {
      success: false,
      error: LANGUAGE_MESSAGES.duplicateName,
      code: result.code,
      field: "name",
    };
  }

  return result;
}

async function checkProfileAccess(
  userId: string,
): Promise<Extract<LanguagesActionResult, { success: false }> | null> {
  const me = await getCurrentUser();

  if (!me.id) {
    return unauthorizedFailure();
  }

  const { canEdit } = getProfilePermissions({
    currentUserId: me.id,
    currentUserRole: me.role,
    targetUserId: userId,
  });

  return canEdit ? null : forbiddenFailure();
}

export async function addLanguageAction(
  userId: string,
  values: AddMyLanguageValues,
): Promise<LanguagesActionResult> {
  const parsed = addMyLanguageSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  const denied = await checkProfileAccess(userId);

  if (denied) {
    return denied;
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    addMyLanguage(
      {
        userId,
        name: data.name,
        proficiency: data.mastery,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return normalizeDuplicate(result);
  }

  revalidateLanguages(userId);

  return { success: true };
}

export async function updateLanguageAction(
  userId: string,
  values: UpdateMyLanguageValues,
): Promise<LanguagesActionResult> {
  const parsed = updateMyLanguageSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  const denied = await checkProfileAccess(userId);

  if (denied) {
    return denied;
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    const languages = await getUserLanguagesWithToken(userId, accessToken);
    const existing = languages.find(
      (language) => language.name === data.name,
    );

    if (!existing) {
      return "missing" as const;
    }

    await updateMyLanguage(
      {
        userId,
        name: data.name,
        proficiency: data.mastery,
      },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "missing") {
    return { success: false, error: "Language not found", code: null };
  }

  revalidateLanguages(userId);

  return { success: true };
}

export async function deleteLanguagesAction(
  userId: string,
  names: string[],
): Promise<LanguagesActionResult> {
  const parsed = deleteNamesSchema.safeParse(names);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  const denied = await checkProfileAccess(userId);

  if (denied) {
    return denied;
  }

  const result = await runAuthed((accessToken) =>
    deleteMyLanguage({ userId, name: parsed.data }, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateLanguages(userId);

  return { success: true };
}
