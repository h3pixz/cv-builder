"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionResult,
  forbiddenFailure,
  getCurrentUser,
  runAuthed,
  unauthorizedFailure,
} from "@/shared/api";

import { cvSchema, type CvValues } from "../model/cv-schema";
import { createCv, deleteCv, updateCv } from "./cvs.mutations";

function invalid(message: string | undefined): ActionResult {
  return {
    success: false,
    error: message ?? "Invalid CV data",
    code: null,
  };
}

function revalidateCvs(ownerId: string | null, cvId?: string) {
  revalidatePath("/cvs");

  if (ownerId) {
    revalidatePath(`/users/${ownerId}/cvs`);
  }

  if (cvId) {
    revalidatePath(`/cvs/${cvId}`, "layout");
  }
}

export async function createCvAction(
  ownerUserId: string,
  values: CvValues,
): Promise<ActionResult> {
  const parsed = cvSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  const me = await getCurrentUser();

  if (!me.id) {
    return unauthorizedFailure();
  }

  if (me.role !== "Admin" && me.id !== ownerUserId) {
    return forbiddenFailure();
  }

  const data = parsed.data;
  const result = await runAuthed((accessToken) =>
    createCv(
      {
        userId: ownerUserId,
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

  revalidateCvs(ownerUserId);

  return { success: true };
}

export async function updateCvAction(
  ownerUserId: string | null,
  cvId: string,
  values: CvValues,
): Promise<ActionResult> {
  const parsed = cvSchema.safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
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

  revalidateCvs(ownerUserId, cvId);

  return { success: true };
}

export async function deleteCvAction(
  ownerUserId: string | null,
  cvId: string,
): Promise<ActionResult> {
  const result = await runAuthed((accessToken) =>
    deleteCv(cvId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidateCvs(ownerUserId, cvId);

  return { success: true };
}
