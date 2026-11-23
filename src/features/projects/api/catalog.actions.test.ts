import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createProject,
  updateProject,
  deleteProject,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
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
  createProject,
  updateProject,
  deleteProject,
}));

import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "./catalog.actions";

const values = {
  name: "  CV Builder  ",
  domain: "  cv-builder.example.com  ",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  description: "  An internal resume builder.  ",
  environment: ["React", "TypeScript"],
};

const payload = {
  name: "CV Builder",
  domain: "cv-builder.example.com",
  start_date: "2025-01-01",
  end_date: "2025-12-31",
  description: "An internal resume builder.",
  environment: ["React", "TypeScript"],
};

beforeEach(() => {
  createProject.mockReset();
  updateProject.mockReset();
  deleteProject.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Admin" });
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createProjectAction", () => {
  it("rejects invalid input before checking the role", async () => {
    const result = await createProjectAction({ ...values, name: "" });

    expect(result).toEqual({
      success: false,
      error: "Project name is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createProject).not.toHaveBeenCalled();
  });

  it("reports an end date earlier than the start date inline", async () => {
    const result = await createProjectAction({
      ...values,
      startDate: "2025-12-31",
      endDate: "2025-01-01",
    });

    expect(result).toEqual({
      success: false,
      error: "End date must be later than start date",
      code: null,
      field: "endDate",
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await createProjectAction(values);

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it("creates the project and revalidates the catalog", async () => {
    const result = await createProjectAction(values);

    expect(result).toEqual({ success: true });
    expect(createProject).toHaveBeenCalledWith(payload, {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
  });

  it("keeps the server error when the request fails", async () => {
    runAuthed.mockResolvedValue({
      success: false,
      error: "Something went wrong. Please try again later",
      code: null,
    });

    const result = await createProjectAction(values);

    expect(result.success).toBe(false);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("updateProjectAction", () => {
  it("updates the project and revalidates the catalog", async () => {
    const result = await updateProjectAction("project-1", values);

    expect(result).toEqual({ success: true });
    expect(updateProject).toHaveBeenCalledWith(
      { projectId: "project-1", ...payload },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await updateProjectAction("project-1", values);

    expect(result.success).toBe(false);
    expect(updateProject).not.toHaveBeenCalled();
  });
});

describe("deleteProjectAction", () => {
  it("deletes the project and revalidates the catalog", async () => {
    const result = await deleteProjectAction("project-1");

    expect(result).toEqual({ success: true });
    expect(deleteProject).toHaveBeenCalledWith("project-1", {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await deleteProjectAction("project-1");

    expect(result.success).toBe(false);
    expect(deleteProject).not.toHaveBeenCalled();
  });
});
