"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionResult,
  forbiddenFailure,
  getCurrentUser,
  runAuthed,
} from "@/shared/api";

import { canAccessCv } from "../model/cv-permissions";
import {
  createCvProjectSchema,
  splitResponsibilities,
  type CvProjectValues,
} from "../model/cv-project-schema";
import {
  addCvProject,
  removeCvProject,
  updateCvProject,
} from "./cvs.mutations";
import { getCv, getCvProject } from "./cvs.queries";

function invalid(message: string | undefined): ActionResult {
  return {
    success: false,
    error: message ?? "Invalid project data",
    code: null,
  };
}

async function loadCvAccess(cvId: string) {
  const [cv, me] = await Promise.all([getCv(cvId), getCurrentUser()]);

  return canAccessCv(me, cv.user?.id);
}

async function validateValues(
  cvId: string,
  values: CvProjectValues,
): Promise<ActionResult | null> {
  if (!(await loadCvAccess(cvId))) {
    return forbiddenFailure();
  }

  const project = await getCvProject(values.projectId).catch(() => null);

  if (!project) {
    return invalid("Project is required");
  }

  const parsed = createCvProjectSchema({
    startDate: project.start_date,
    endDate: project.end_date ?? null,
  }).safeParse(values);

  if (!parsed.success) {
    return invalid(parsed.error.issues[0]?.message);
  }

  return null;
}

export async function addCvProjectAction(
  cvId: string,
  values: CvProjectValues,
): Promise<ActionResult> {
  const failure = await validateValues(cvId, values);

  if (failure) {
    return failure;
  }

  const result = await runAuthed((accessToken) =>
    addCvProject(
      {
        cvId,
        projectId: values.projectId,
        start_date: values.startDate,
        end_date: values.endDate || null,
        roles: values.roles,
        responsibilities: splitResponsibilities(values.responsibilities),
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

export async function updateCvProjectAction(
  cvId: string,
  values: CvProjectValues,
): Promise<ActionResult> {
  const failure = await validateValues(cvId, values);

  if (failure) {
    return failure;
  }

  const result = await runAuthed((accessToken) =>
    updateCvProject(
      {
        cvId,
        projectId: values.projectId,
        start_date: values.startDate,
        end_date: values.endDate || null,
        roles: values.roles,
        responsibilities: splitResponsibilities(values.responsibilities),
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

export async function removeCvProjectAction(
  cvId: string,
  projectId: string,
): Promise<ActionResult> {
  if (!(await loadCvAccess(cvId))) {
    return forbiddenFailure();
  }

  const result = await runAuthed((accessToken) =>
    removeCvProject(cvId, projectId, { accessToken }),
  );

  if (!result.success) {
    return result;
  }

  revalidatePath(`/cvs/${cvId}`, "layout");

  return { success: true };
}
