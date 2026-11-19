"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  type ActionResult,
  ERROR_MESSAGES,
  forbiddenFailure,
  getCurrentUser,
  runAuthed,
} from "@/shared/api";

import { canAccessCv } from "../model/cv-permissions";
import { cvSkillSchema } from "../model/cv-skill-schema";
import { addCvSkill, deleteCvSkill } from "./cvs.mutations";
import { getCv } from "./cvs.queries";

const namesSchema = z.array(z.string().trim().min(1)).min(1);

function invalid(message: string | undefined): ActionResult {
  return {
    success: false,
    error: message ?? "Invalid skill data",
    code: null,
  };
}

async function loadOwnedCv(cvId: string) {
  const [cv, me] = await Promise.all([getCv(cvId), getCurrentUser()]);

  return { cv, allowed: canAccessCv(me, cv.user?.id) };
}

function findOwnerSkill(
  cv: Awaited<ReturnType<typeof getCv>>,
  name: string,
) {
  return cv.user?.profile.skills.find((skill) => skill.name === name);
}

export async function addCvSkillAction(
  cvId: string,
  name: string,
): Promise<ActionResult> {
  const parsed = cvSkillSchema.safeParse({ name });

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  const { cv, allowed } = await loadOwnedCv(cvId);

  if (!allowed) {
    return forbiddenFailure();
  }

  const ownerSkill = findOwnerSkill(cv, parsed.data.name);

  if (!ownerSkill) {
    return invalid("Skill is not available");
  }

  if (cv.skills.some((skill) => skill.name === ownerSkill.name)) {
    return {
      success: false,
      error: ERROR_MESSAGES.skillHasBeenAdded,
      code: "skillHasBeenAdded",
    };
  }

  const result = await runAuthed((accessToken) =>
    addCvSkill(
      {
        cvId,
        name: ownerSkill.name,
        categoryId: ownerSkill.categoryId,
        mastery: ownerSkill.mastery,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidatePath(`/cvs/${cvId}`, "layout");

  return { success: true };
}

export async function updateCvSkillAction(
  cvId: string,
  currentName: string,
  nextName: string,
): Promise<ActionResult> {
  const current = cvSkillSchema.safeParse({ name: currentName });
  const next = cvSkillSchema.safeParse({ name: nextName });

  if (!current.success || !next.success) {
    return invalid("Skill is required");
  }

  if (current.data.name === next.data.name) {
    return { success: true };
  }

  const { cv, allowed } = await loadOwnedCv(cvId);

  if (!allowed) {
    return forbiddenFailure();
  }

  const ownerSkill = findOwnerSkill(cv, next.data.name);

  if (!ownerSkill) {
    return invalid("Skill is not available");
  }

  if (cv.skills.some((skill) => skill.name === ownerSkill.name)) {
    return {
      success: false,
      error: ERROR_MESSAGES.skillHasBeenAdded,
      code: "skillHasBeenAdded",
    };
  }

  const result = await runAuthed(async (accessToken) => {
    await addCvSkill(
      {
        cvId,
        name: ownerSkill.name,
        categoryId: ownerSkill.categoryId,
        mastery: ownerSkill.mastery,
      },
      { accessToken },
    );
    await deleteCvSkill(cvId, [current.data.name], { accessToken });
  });

  if (!result.success) {
    return result;
  }

  revalidatePath(`/cvs/${cvId}`, "layout");

  return { success: true };
}

export async function removeCvSkillsAction(
  cvId: string,
  names: string[],
): Promise<ActionResult> {
  const parsed = namesSchema.safeParse(names);

  if (!parsed.success) {
    return invalid("Select at least one skill");
  }

  const { allowed } = await loadOwnedCv(cvId);

  if (!allowed) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteCvSkill(cvId, parsed.data, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidatePath(`/cvs/${cvId}`, "layout");

  return { success: true };
}
