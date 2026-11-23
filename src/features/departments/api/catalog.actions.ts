"use server";

import type { DepartmentsActionResult } from "../model/action-result";
import {
  DEPARTMENT_MESSAGES,
  catalogDepartmentSchema,
  type CatalogDepartmentValues,
} from "../model/department-schema";
import { canManageDepartmentCatalog } from "../model/department-permissions";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "./catalog.mutations";
import { getCurrentUser } from "./current-user";
import { forbiddenFailure, runAuthed } from "./run-authed";
import {
  findDepartmentByName,
  isDepartmentInUse,
} from "./departments.queries";
import { revalidateDepartmentCatalog } from "./departments-revalidate";

type Field = NonNullable<
  Extract<DepartmentsActionResult, { success: false }>["field"]
>;

function invalid(
  message: string | undefined,
  field?: Field,
): DepartmentsActionResult {
  return {
    success: false,
    error: message ?? "Invalid department data",
    code: null,
    field,
  };
}

function fieldFromPath(path?: PropertyKey[]): Field | undefined {
  return path?.[0] === "name" ? "name" : undefined;
}

async function canManage(): Promise<boolean> {
  const me = await getCurrentUser();

  return canManageDepartmentCatalog(me.role);
}

export async function createDepartmentAction(
  values: CatalogDepartmentValues,
): Promise<DepartmentsActionResult> {
  const parsed = catalogDepartmentSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    if (await findDepartmentByName(data.name, { accessToken })) {
      return "duplicate" as const;
    }

    await createDepartment({ name: data.name }, { accessToken });

    return "created" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "duplicate") {
    return {
      success: false,
      error: DEPARTMENT_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidateDepartmentCatalog();

  return { success: true };
}

export async function updateDepartmentAction(
  departmentId: string,
  values: CatalogDepartmentValues,
): Promise<DepartmentsActionResult> {
  const parsed = catalogDepartmentSchema.safeParse(values);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return invalid(issue?.message, fieldFromPath(issue?.path));
  }

  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const data = parsed.data;

  const result = await runAuthed(async (accessToken) => {
    if (
      await findDepartmentByName(data.name, {
        accessToken,
        excludeId: departmentId,
      })
    ) {
      return "duplicate" as const;
    }

    await updateDepartment(
      { departmentId, name: data.name },
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
      error: DEPARTMENT_MESSAGES.duplicate,
      code: null,
      field: "name",
    };
  }

  revalidateDepartmentCatalog();

  return { success: true };
}

export async function deleteDepartmentAction(
  departmentId: string,
): Promise<DepartmentsActionResult> {
  if (!(await canManage())) {
    return forbiddenFailure();
  }

  const result = await runAuthed(async (accessToken) => {
    if (await isDepartmentInUse(departmentId, { accessToken })) {
      return "in-use" as const;
    }

    await deleteDepartment(departmentId, { accessToken });

    return "deleted" as const;
  });

  if (!result.success) {
    return result;
  }

  if (result.data === "in-use") {
    return {
      success: false,
      error: DEPARTMENT_MESSAGES.inUse,
      code: null,
    };
  }

  revalidateDepartmentCatalog();

  return { success: true };
}
