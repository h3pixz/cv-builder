"use server";

import type { LanguagesActionResult } from "../model/action-result";
import {
  LANGUAGE_MESSAGES,
  catalogLanguageSchema,
  type CatalogLanguageValues,
} from "../model/language-schema";
import { canManageLanguageCatalog } from "../model/language-permissions";
import { createLanguage, deleteLanguage, updateLanguage } from "./catalog.mutations";
import { getCurrentUser } from "./current-user";
import { forbiddenFailure, runAuthed } from "./run-authed";
import {
  findLanguageByIso,
  findLanguageByName,
} from "./languages.queries";
import { revalidateLanguageCatalog } from "./languages-revalidate";

type Field = NonNullable<
  Extract<LanguagesActionResult, { success: false }>["field"]
>;

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

  return key === "name" || key === "iso2" || key === "nativeName"
    ? key
    : undefined;
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManageLanguageCatalog(me.role);
}

export async function createLanguageAction(
  values: CatalogLanguageValues,
): Promise<LanguagesActionResult> {
  const parsed = catalogLanguageSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const iso2 = data.iso2.toUpperCase();

  const result = await runAuthed(async (accessToken) => {
    if (await findLanguageByName(data.name, { accessToken })) {
      return "duplicate-name" as const;
    }

    if (await findLanguageByIso(iso2, { accessToken })) {
      return "duplicate-iso" as const;
    }

    await createLanguage(
      {
        name: data.name,
        iso2,
        native_name: data.nativeName,
      },
      { accessToken },
    );

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate-name") {
    return {
      success: false,
      error: LANGUAGE_MESSAGES.duplicateName,
      code: null,
      field: "name",
    };
  }

  if (result.data === "duplicate-iso") {
    return {
      success: false,
      error: LANGUAGE_MESSAGES.duplicateIso,
      code: null,
      field: "iso2",
    };
  }

  revalidateLanguageCatalog();

  return { success: true };
}

export async function updateLanguageAction(
  languageId: string,
  values: CatalogLanguageValues,
): Promise<LanguagesActionResult> {
  const parsed = catalogLanguageSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const iso2 = data.iso2.toUpperCase();

  const result = await runAuthed(async (accessToken) => {
    if (
      await findLanguageByName(data.name, {
        accessToken,
        excludeId: languageId,
      })
    ) {
      return "duplicate-name" as const;
    }

    if (
      await findLanguageByIso(iso2, {
        accessToken,
        excludeId: languageId,
      })
    ) {
      return "duplicate-iso" as const;
    }

    await updateLanguage(
      {
        languageId,
        name: data.name,
        iso2,
        native_name: data.nativeName,
      },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate-name") {
    return {
      success: false,
      error: LANGUAGE_MESSAGES.duplicateName,
      code: null,
      field: "name",
    };
  }

  if (result.data === "duplicate-iso") {
    return {
      success: false,
      error: LANGUAGE_MESSAGES.duplicateIso,
      code: null,
      field: "iso2",
    };
  }

  revalidateLanguageCatalog();

  return { success: true };
}

export async function deleteLanguageAction(
  languageId: string,
): Promise<LanguagesActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteLanguage(languageId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateLanguageCatalog();

  return { success: true };
}
