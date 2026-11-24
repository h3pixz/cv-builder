"use server";

import type { ProjectsActionResult } from "../model/action-result";
import { projectSchema, type ProjectFormValues } from "../model/project-schema";
import { canManageProjectCatalog } from "../model/project-permissions";
import {
  createProject,
  deleteProject,
  updateProject,
} from "./catalog.mutations";
import { getCurrentUser } from "./current-user";
import { revalidateProjectCatalog } from "./projects-revalidate";
import { forbiddenFailure, runAuthed } from "./run-authed";

type Field = NonNullable<
  Extract<ProjectsActionResult, { success: false }>["field"]
>;

function invalid(
  message: string | undefined,
  field?: Field,
): ProjectsActionResult {
  return {
    success: false,
    error: message ?? "Invalid project data",
    code: null,
    field,
  };
}

function fieldFromPath(path?: PropertyKey[]): Field | undefined {
  const key = path?.[0];

  return key === "name" ||
    key === "domain" ||
    key === "startDate" ||
    key === "endDate" ||
    key === "description"
    ? key
    : undefined;
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManageProjectCatalog(me.role);
}

function toProjectPayload(values: ProjectFormValues) {
  return {
    name: values.name,
    domain: values.domain,
    start_date: values.startDate,
    end_date: values.endDate,
    description: values.description,
    environment: values.environment,
  };
}

export async function createProjectAction(
  values: ProjectFormValues,
): Promise<ProjectsActionResult> {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed(async (accessToken) => {
    await createProject(toProjectPayload(parsed.data), { accessToken });

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  revalidateProjectCatalog();

  return { success: true };
}

export async function updateProjectAction(
  projectId: string,
  values: ProjectFormValues,
): Promise<ProjectsActionResult> {
  const parsed = projectSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed(async (accessToken) => {
    await updateProject(
      { projectId, ...toProjectPayload(parsed.data) },
      { accessToken },
    );

    return "updated" as const;
  });

  if (!result.success) {
    return result;
  }

  revalidateProjectCatalog();

  return { success: true };
}

export async function deleteProjectAction(
  projectId: string,
): Promise<ProjectsActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed(async (accessToken) => {
    await deleteProject(projectId, { accessToken });

    return "deleted" as const;
  });

  if (!result.success) {
    return result;
  }

  revalidateProjectCatalog();

  return { success: true };
}
