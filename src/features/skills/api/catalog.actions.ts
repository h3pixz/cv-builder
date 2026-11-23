"use server";

import {
  catalogSkillSchema,
  SKILL_MESSAGES,
  type CatalogSkillValues,
} from "../model/skill-schema";
import type { SkillsActionResult } from "../model/action-result";
import { canManageSkillCatalog } from "../model/skill-permissions";
import { createSkill, deleteSkill, updateSkill } from "./catalog.mutations";
import { getCurrentUser } from "./current-user";
import { forbiddenFailure, runAuthed } from "./run-authed";
import { findSkillByName } from "./skills.queries";
import { revalidateSkillCatalog } from "./skills-revalidate";

function invalid(
  message: string | undefined,
  field?: "name" | "categoryId",
): SkillsActionResult {
  return {
    success: false,
    error: message ?? "Invalid skill data",
    code: null,
    field,
  };
}

function fieldFromPath(
  path?: PropertyKey[],
): "name" | "categoryId" | undefined {
  const key = path?.[0];

  return key === "name" || key === "categoryId" ? key : undefined;
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManageSkillCatalog(me.role);
}

export async function createSkillAction(
  values: CatalogSkillValues,
): Promise<SkillsActionResult> {
  const parsed = catalogSkillSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    const duplicate = await findSkillByName(data.name, { accessToken });

    if (duplicate) {
      return "duplicate" as const;
    }

    await createSkill(
      {
        name: data.name,
        categoryId: data.categoryId,
      },
      { accessToken },
    );

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate") {
    return {
      success: false,
      error: SKILL_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidateSkillCatalog();

  return { success: true };
}

export async function updateSkillAction(
  skillId: string,
  values: CatalogSkillValues,
): Promise<SkillsActionResult> {
  const parsed = catalogSkillSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed(async (accessToken) => {
    const duplicate = await findSkillByName(data.name, {
      accessToken,
      excludeId: skillId,
    });

    if (duplicate) {
      return "duplicate" as const;
    }

    await updateSkill(
      {
        skillId,
        name: data.name,
        categoryId: data.categoryId,
      },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate") {
    return {
      success: false,
      error: SKILL_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidateSkillCatalog();

  return { success: true };
}

export async function deleteSkillAction(
  skillId: string,
): Promise<SkillsActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteSkill(skillId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateSkillCatalog();

  return { success: true };
}
