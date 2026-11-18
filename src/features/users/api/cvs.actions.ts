"use server";

import { revalidatePath } from "next/cache";

import type { UsersActionResult } from "../model/action-result";
import { canManageCvs } from "../model/cv-permissions";
import { cvSchema, type CvValues } from "../model/cv-schema";
import { createCv, deleteCv, updateCv } from "./cvs.mutations";
import { getCurrentUser } from "./profile.queries";
import { forbiddenFailure, runAuthed } from "./run-authed";

function invalid(message: string | undefined): UsersActionResult {
  return {
    success: false,
    error: message ?? "Invalid CV data",
    code: null,
  };
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManageCvs(me.role);
}

function revalidateCvs(userId: string, cvId?: string) {
  revalidatePath(`/users/${userId}/cvs`);

  if (cvId) {
    revalidatePath(`/users/${userId}/cvs/${cvId}`);
  }
}

export async function createCvAction(
  userId: string,
  values: CvValues,
): Promise<UsersActionResult> {
  const parsed = cvSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    createCv(
      {
        userId,
        name: data.name,
        education: data.education,
        description: data.description,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidateCvs(userId);

  return { success: true };
}

export async function updateCvAction(
  userId: string,
  cvId: string,
  values: CvValues,
): Promise<UsersActionResult> {
  const parsed = cvSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    updateCv(
      {
        cvId,
        name: data.name,
        education: data.education,
        description: data.description,
      },
      { accessToken },
    ),
  );

  if (!result.success) {
    return result;
  }

  revalidateCvs(userId, cvId);

  return { success: true };
}

export async function deleteCvAction(
  userId: string,
  cvId: string,
): Promise<UsersActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    deleteCv(cvId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateCvs(userId, cvId);

  return { success: true };
}
