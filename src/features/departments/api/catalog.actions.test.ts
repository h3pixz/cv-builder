import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  findDepartmentByName,
  isDepartmentInUse,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createDepartment: vi.fn(),
  updateDepartment: vi.fn(),
  deleteDepartment: vi.fn(),
  findDepartmentByName: vi.fn(),
  isDepartmentInUse: vi.fn(),
  getCurrentUser: vi.fn(),
  revalidatePath: vi.fn(),
  runAuthed: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("./current-user", () => ({ getCurrentUser }));

vi.mock("./run-authed", () => ({
  runAuthed,
  forbiddenFailure: () => ({
    success: false,
    error: "You do not have permission to perform this action",
    code: "insufficientPermissions",
  }),
}));

vi.mock("./catalog.mutations", () => ({
  createDepartment,
  updateDepartment,
  deleteDepartment,
}));

vi.mock("./departments.queries", () => ({
  findDepartmentByName,
  isDepartmentInUse,
}));

import {
  createDepartmentAction,
  deleteDepartmentAction,
  updateDepartmentAction,
} from "./catalog.actions";

const values = { name: "  Engineering  " };

beforeEach(() => {
  createDepartment.mockReset();
  updateDepartment.mockReset();
  deleteDepartment.mockReset();
  findDepartmentByName.mockReset();
  isDepartmentInUse.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Admin" });
  findDepartmentByName.mockResolvedValue(null);
  isDepartmentInUse.mockResolvedValue(false);
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createDepartmentAction", () => {
  it("rejects invalid input before checking the role", async () => {
    const result = await createDepartmentAction({ name: "" });

    expect(result).toEqual({
      success: false,
      error: "Department name is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createDepartment).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await createDepartmentAction(values);

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(createDepartment).not.toHaveBeenCalled();
  });

  it("returns an inline error when the name already exists", async () => {
    findDepartmentByName.mockResolvedValue({
      id: "department-1",
      name: "Engineering",
    });

    const result = await createDepartmentAction(values);

    expect(result).toEqual({
      success: false,
      error: "Department already exists",
      code: null,
      field: "name",
    });
    expect(createDepartment).not.toHaveBeenCalled();
  });

  it("creates the department and revalidates the catalog", async () => {
    const result = await createDepartmentAction(values);

    expect(result).toEqual({ success: true });
    expect(findDepartmentByName).toHaveBeenCalledWith("Engineering", {
      accessToken: "token",
    });
    expect(createDepartment).toHaveBeenCalledWith(
      { name: "Engineering" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/departments");
    expect(revalidatePath).toHaveBeenCalledWith("/users");
  });
});

describe("updateDepartmentAction", () => {
  it("excludes the edited department from the duplicate check", async () => {
    const result = await updateDepartmentAction("department-1", values);

    expect(result).toEqual({ success: true });
    expect(findDepartmentByName).toHaveBeenCalledWith("Engineering", {
      accessToken: "token",
      excludeId: "department-1",
    });
    expect(updateDepartment).toHaveBeenCalledWith(
      { departmentId: "department-1", name: "Engineering" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/departments");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await updateDepartmentAction("department-1", values);

    expect(result.success).toBe(false);
    expect(updateDepartment).not.toHaveBeenCalled();
  });
});

describe("deleteDepartmentAction", () => {
  it("refuses to delete a department that is in use", async () => {
    isDepartmentInUse.mockResolvedValue(true);

    const result = await deleteDepartmentAction("department-1");

    expect(result).toEqual({
      success: false,
      error: "Department cannot be deleted because it is currently in use",
      code: null,
    });
    expect(deleteDepartment).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("deletes the department and revalidates the catalog", async () => {
    const result = await deleteDepartmentAction("department-1");

    expect(result).toEqual({ success: true });
    expect(isDepartmentInUse).toHaveBeenCalledWith("department-1", {
      accessToken: "token",
    });
    expect(deleteDepartment).toHaveBeenCalledWith("department-1", {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/departments");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await deleteDepartmentAction("department-1");

    expect(result.success).toBe(false);
    expect(deleteDepartment).not.toHaveBeenCalled();
  });
});
