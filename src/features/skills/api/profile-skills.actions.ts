"use server";

import { z } from "zod";

import type { SkillsActionResult } from "../model/action-result";
import {
  addMySkillSchema,
  updateMySkillSchema,
  type AddMySkillValues,
  type UpdateMySkillValues,
} from "../model/skill-schema";
import { getCurrentUser } from "./current-user";
import {
  addMySkill,
  deleteMySkill,
  updateMySkill,
} from "./profile-skills.mutations";
import { runAuthed, unauthorizedFailure } from "./run-authed";
import { getMySkillsWithToken } from "./skills.queries";
import { revalidateMySkills } from "./skills-revalidate";

type Field = NonNullable<
  Extract<SkillsActionResult, { success: false }>["field"]
>;

const deleteNamesSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one skill");

function invalid(
  message: string | undefined,
  field?: Field,
): SkillsActionResult {
  return {
    success: false,
    error: message ?? "Invalid skill data",
    code: null,
    field,
  };
}

function fieldFromPath(path?: PropertyKey[]): Field | undefined {
  const key = path?.[0];

  return key === "name" || key === "mastery" ? key : undefined;
}

export async function addMySkillAction(
  values: AddMySkillValues,
): Promise<SkillsActionResult> {
  const parsed = addMySkillSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  const me = await getCurrentUser();

  if (!me.id) {
    return unauthorizedFailure();
  }

  const userId = me.id;
  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    await addMySkill(
      {
        userId,
        name: data.name,
        categoryId: data.categoryId ?? undefined,
        mastery: data.mastery,
      },
      { accessToken },
    );

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  revalidateMySkills(userId);

  return { success: true };
}

export async function updateMySkillAction(
  values: UpdateMySkillValues,
): Promise<SkillsActionResult> {
  const parsed = updateMySkillSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  const me = await getCurrentUser();

  if (!me.id) {
    return unauthorizedFailure();
  }

  const userId = me.id;
  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    const skills = await getMySkillsWithToken(accessToken);
    const existing = skills.find((skill) => skill.name === data.name);

    if (!existing) {
      return "missing" as const;
    }

    await updateMySkill(
      {
        userId,
        name: data.name,
        categoryId: existing.categoryId ?? undefined,
        mastery: data.mastery,
      },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "missing") {
    return { success: false, error: "Skill not found", code: null };
  }

  revalidateMySkills(userId);

  return { success: true };
}

export async function deleteMySkillsAction(
  names: string[],
): Promise<SkillsActionResult> {
  const parsed = deleteNamesSchema.safeParse(names);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  const me = await getCurrentUser();

  if (!me.id) {
    return unauthorizedFailure();
  }

  const userId = me.id;

  const result = await runAuthed((accessToken) =>
    deleteMySkill({ userId, name: parsed.data }, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateMySkills(userId);

  return { success: true };
}
