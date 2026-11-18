import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createCv,
  updateCv,
  deleteCv,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createCv: vi.fn(),
  updateCv: vi.fn(),
  deleteCv: vi.fn(),
  getCurrentUser: vi.fn(),
  revalidatePath: vi.fn(),
  runAuthed: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));

vi.mock("./profile.queries", () => ({ getCurrentUser }));

vi.mock("./run-authed", () => ({
  runAuthed,
  forbiddenFailure: () => ({
    success: false,
    error: "You do not have permission to perform this action",
    code: "insufficientPermissions",
  }),
}));

vi.mock("./cvs.mutations", () => ({ createCv, updateCv, deleteCv }));

import {
  createCvAction,
  deleteCvAction,
  updateCvAction,
} from "./cvs.actions";

const values = {
  name: "  Frontend CV  ",
  education: "  BSUIR  ",
  description: "  Built the design system.  ",
};

beforeEach(() => {
  createCv.mockReset();
  updateCv.mockReset();
  deleteCv.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ role: "Admin" });
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createCvAction", () => {
  it("rejects invalid input", async () => {
    const result = await createCvAction("user-1", {
      name: "",
      education: "",
      description: "",
    });

    expect(result).toEqual({
      success: false,
      error: "Name is required",
      code: null,
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createCv).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ role: "Employee" });

    const result = await createCvAction("user-1", values);

    expect(result.success).toBe(false);
    expect(createCv).not.toHaveBeenCalled();
  });

  it("assigns the CV to the selected employee and revalidates", async () => {
    const result = await createCvAction("user-1", values);

    expect(result).toEqual({ success: true });
    expect(createCv).toHaveBeenCalledWith(
      {
        userId: "user-1",
        name: "Frontend CV",
        education: "BSUIR",
        description: "Built the design system.",
      },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/cvs");
  });
});

describe("updateCvAction", () => {
  it("updates the CV and revalidates both pages", async () => {
    const result = await updateCvAction("user-1", "cv-1", values);

    expect(result).toEqual({ success: true });
    expect(updateCv).toHaveBeenCalledWith(
      {
        cvId: "cv-1",
        name: "Frontend CV",
        education: "BSUIR",
        description: "Built the design system.",
      },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/cvs");
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/cvs/cv-1");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ role: "Employee" });

    const result = await updateCvAction("user-1", "cv-1", values);

    expect(result.success).toBe(false);
    expect(updateCv).not.toHaveBeenCalled();
  });
});

describe("deleteCvAction", () => {
  it("deletes the CV and revalidates the list", async () => {
    const result = await deleteCvAction("user-1", "cv-1");

    expect(result).toEqual({ success: true });
    expect(deleteCv).toHaveBeenCalledWith("cv-1", { accessToken: "token" });
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/cvs");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ role: "Employee" });

    const result = await deleteCvAction("user-1", "cv-1");

    expect(result.success).toBe(false);
    expect(deleteCv).not.toHaveBeenCalled();
  });
});
