import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createSkill,
  updateSkill,
  deleteSkill,
  findSkillByName,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createSkill: vi.fn(),
  updateSkill: vi.fn(),
  deleteSkill: vi.fn(),
  findSkillByName: vi.fn(),
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

vi.mock("./catalog.mutations", () => ({ createSkill, updateSkill, deleteSkill }));

vi.mock("./skills.queries", () => ({ findSkillByName }));

import {
  createSkillAction,
  deleteSkillAction,
  updateSkillAction,
} from "./catalog.actions";

const values = { name: "  React  ", categoryId: "frontend" };

beforeEach(() => {
  createSkill.mockReset();
  updateSkill.mockReset();
  deleteSkill.mockReset();
  findSkillByName.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Admin" });
  findSkillByName.mockResolvedValue(null);
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createSkillAction", () => {
  it("rejects invalid input before checking the role", async () => {
    const result = await createSkillAction({ name: "", categoryId: "" });

    expect(result).toEqual({
      success: false,
      error: "Skill is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createSkill).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await createSkillAction(values);

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(createSkill).not.toHaveBeenCalled();
  });

  it("returns an inline error when the skill already exists", async () => {
    findSkillByName.mockResolvedValue({ id: "skill-1", name: "React" });

    const result = await createSkillAction(values);

    expect(result).toEqual({
      success: false,
      error: "Skill already exists",
      code: null,
      field: "name",
    });
    expect(createSkill).not.toHaveBeenCalled();
  });

  it("creates the skill and revalidates the catalog", async () => {
    const result = await createSkillAction(values);

    expect(result).toEqual({ success: true });
    expect(findSkillByName).toHaveBeenCalledWith("React", {
      accessToken: "token",
    });
    expect(createSkill).toHaveBeenCalledWith(
      { name: "React", categoryId: "frontend" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/skills");
    expect(revalidatePath).toHaveBeenCalledWith("/skills");
  });
});

describe("updateSkillAction", () => {
  it("excludes the edited skill from the duplicate check", async () => {
    const result = await updateSkillAction("skill-1", values);

    expect(result).toEqual({ success: true });
    expect(findSkillByName).toHaveBeenCalledWith("React", {
      accessToken: "token",
      excludeId: "skill-1",
    });
    expect(updateSkill).toHaveBeenCalledWith(
      { skillId: "skill-1", name: "React", categoryId: "frontend" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/skills");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await updateSkillAction("skill-1", values);

    expect(result.success).toBe(false);
    expect(updateSkill).not.toHaveBeenCalled();
  });
});

describe("deleteSkillAction", () => {
  it("deletes the skill and revalidates the catalog", async () => {
    const result = await deleteSkillAction("skill-1");

    expect(result).toEqual({ success: true });
    expect(deleteSkill).toHaveBeenCalledWith("skill-1", {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/skills");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await deleteSkillAction("skill-1");

    expect(result.success).toBe(false);
    expect(deleteSkill).not.toHaveBeenCalled();
  });
});
