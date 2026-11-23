import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  addMySkill,
  updateMySkill,
  deleteMySkill,
  findSkillByName,
  getMySkillsWithToken,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  addMySkill: vi.fn(),
  updateMySkill: vi.fn(),
  deleteMySkill: vi.fn(),
  findSkillByName: vi.fn(),
  getMySkillsWithToken: vi.fn(),
  getCurrentUser: vi.fn(),
  revalidatePath: vi.fn(),
  runAuthed: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("./current-user", () => ({ getCurrentUser }));

vi.mock("./run-authed", () => ({
  runAuthed,
  unauthorizedFailure: () => ({
    success: false,
    error: "You need to sign in to continue",
    code: "unauthorized",
  }),
}));

vi.mock("./profile-skills.mutations", () => ({
  addMySkill,
  updateMySkill,
  deleteMySkill,
}));

vi.mock("./skills.queries", () => ({ findSkillByName, getMySkillsWithToken }));

import {
  addMySkillAction,
  deleteMySkillsAction,
  updateMySkillAction,
} from "./profile-skills.actions";

beforeEach(() => {
  addMySkill.mockReset();
  updateMySkill.mockReset();
  deleteMySkill.mockReset();
  findSkillByName.mockReset();
  getMySkillsWithToken.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });
  findSkillByName.mockResolvedValue(null);
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("addMySkillAction", () => {
  it("rejects invalid input", async () => {
    const result = await addMySkillAction({ name: "", mastery: "Expert" });

    expect(result).toEqual({
      success: false,
      error: "Skill is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(addMySkill).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getCurrentUser.mockResolvedValue({ id: null, role: null });

    const result = await addMySkillAction({
      name: "React",
      mastery: "Expert",
    });

    expect(result).toEqual({
      success: false,
      error: "You need to sign in to continue",
      code: "unauthorized",
    });
    expect(addMySkill).not.toHaveBeenCalled();
  });

  it("adds the skill to the current user and revalidates both pages", async () => {
    const result = await addMySkillAction({
      name: "  React  ",
      mastery: "Expert",
      categoryId: "frontend",
    });

    expect(result).toEqual({ success: true });
    expect(addMySkill).toHaveBeenCalledWith(
      {
        userId: "user-1",
        name: "React",
        categoryId: "frontend",
        mastery: "Expert",
      },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/skills");
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/skills");
  });
});

describe("updateMySkillAction", () => {
  it("keeps the existing category when only the mastery changes", async () => {
    getMySkillsWithToken.mockResolvedValue([
      { name: "React", categoryId: "frontend", mastery: "Advanced" },
    ]);

    const result = await updateMySkillAction({
      name: "React",
      mastery: "Proficient",
    });

    expect(result).toEqual({ success: true });
    expect(updateMySkill).toHaveBeenCalledWith(
      {
        userId: "user-1",
        name: "React",
        categoryId: "frontend",
        mastery: "Proficient",
      },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/skills");
  });

  it("reports a skill that is no longer assigned", async () => {
    getMySkillsWithToken.mockResolvedValue([]);

    const result = await updateMySkillAction({
      name: "React",
      mastery: "Expert",
    });

    expect(result).toEqual({
      success: false,
      error: "Skill not found",
      code: null,
    });
    expect(updateMySkill).not.toHaveBeenCalled();
  });
});

describe("deleteMySkillsAction", () => {
  it("rejects an empty selection", async () => {
    const result = await deleteMySkillsAction([]);

    expect(result.success).toBe(false);
    expect(deleteMySkill).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getCurrentUser.mockResolvedValue({ id: null, role: null });

    const result = await deleteMySkillsAction(["React"]);

    expect(result).toEqual({
      success: false,
      error: "You need to sign in to continue",
      code: "unauthorized",
    });
  });

  it("deletes the selected skills and revalidates", async () => {
    const result = await deleteMySkillsAction(["React", "CSS"]);

    expect(result).toEqual({ success: true });
    expect(deleteMySkill).toHaveBeenCalledWith(
      { userId: "user-1", name: ["React", "CSS"] },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/skills");
  });
});
