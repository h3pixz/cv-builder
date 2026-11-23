import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  addMyLanguage,
  updateMyLanguage,
  deleteMyLanguage,
  getUserLanguagesWithToken,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  addMyLanguage: vi.fn(),
  updateMyLanguage: vi.fn(),
  deleteMyLanguage: vi.fn(),
  getUserLanguagesWithToken: vi.fn(),
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
  forbiddenFailure: () => ({
    success: false,
    error: "You do not have permission to perform this action",
    code: "insufficientPermissions",
  }),
}));

vi.mock("./profile-languages.mutations", () => ({
  addMyLanguage,
  updateMyLanguage,
  deleteMyLanguage,
}));

vi.mock("./languages.queries", () => ({ getUserLanguagesWithToken }));

import {
  addLanguageAction,
  deleteLanguagesAction,
  updateLanguageAction,
} from "./profile-languages.actions";

beforeEach(() => {
  addMyLanguage.mockReset();
  updateMyLanguage.mockReset();
  deleteMyLanguage.mockReset();
  getUserLanguagesWithToken.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("addLanguageAction", () => {
  it("rejects invalid input", async () => {
    const result = await addLanguageAction("user-1", {
      name: "",
      mastery: "B2",
    });

    expect(result).toEqual({
      success: false,
      error: "Language is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(addMyLanguage).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getCurrentUser.mockResolvedValue({ id: null, role: null });

    const result = await addLanguageAction("user-1", {
      name: "English",
      mastery: "B2",
    });

    expect(result).toEqual({
      success: false,
      error: "You need to sign in to continue",
      code: "unauthorized",
    });
    expect(addMyLanguage).not.toHaveBeenCalled();
  });

  it("does not let an employee edit another user's languages", async () => {
    const result = await addLanguageAction("user-2", {
      name: "English",
      mastery: "B2",
    });

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(addMyLanguage).not.toHaveBeenCalled();
  });

  it("adds the language and revalidates both pages", async () => {
    const result = await addLanguageAction("user-1", {
      name: "  English  ",
      mastery: "Native",
    });

    expect(result).toEqual({ success: true });
    expect(addMyLanguage).toHaveBeenCalledWith(
      { userId: "user-1", name: "English", proficiency: "Native" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/languages");
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-1/languages");
  });

  it("lets an admin manage another user's languages", async () => {
    getCurrentUser.mockResolvedValue({ id: "admin-1", role: "Admin" });

    const result = await addLanguageAction("user-2", {
      name: "English",
      mastery: "B2",
    });

    expect(result).toEqual({ success: true });
    expect(addMyLanguage).toHaveBeenCalledWith(
      { userId: "user-2", name: "English", proficiency: "B2" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/users/user-2/languages");
  });

  it("maps a duplicate assignment to an inline name error", async () => {
    runAuthed.mockResolvedValue({
      success: false,
      error: "This language has already been added",
      code: "languageHasBeenAdded",
    });

    const result = await addLanguageAction("user-1", {
      name: "English",
      mastery: "B2",
    });

    expect(result).toEqual({
      success: false,
      error: "Language already exists",
      code: "languageHasBeenAdded",
      field: "name",
    });
  });
});

describe("updateLanguageAction", () => {
  it("updates the proficiency of an assigned language", async () => {
    getUserLanguagesWithToken.mockResolvedValue([
      { name: "English", proficiency: "B2" },
    ]);

    const result = await updateLanguageAction("user-1", {
      name: "English",
      mastery: "C1",
    });

    expect(result).toEqual({ success: true });
    expect(updateMyLanguage).toHaveBeenCalledWith(
      { userId: "user-1", name: "English", proficiency: "C1" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/languages");
  });

  it("reports a language that is no longer assigned", async () => {
    getUserLanguagesWithToken.mockResolvedValue([]);

    const result = await updateLanguageAction("user-1", {
      name: "English",
      mastery: "C1",
    });

    expect(result).toEqual({
      success: false,
      error: "Language not found",
      code: null,
    });
    expect(updateMyLanguage).not.toHaveBeenCalled();
  });
});

describe("deleteLanguagesAction", () => {
  it("rejects an empty selection", async () => {
    const result = await deleteLanguagesAction("user-1", []);

    expect(result.success).toBe(false);
    expect(deleteMyLanguage).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    getCurrentUser.mockResolvedValue({ id: null, role: null });

    const result = await deleteLanguagesAction("user-1", ["English"]);

    expect(result).toEqual({
      success: false,
      error: "You need to sign in to continue",
      code: "unauthorized",
    });
  });

  it("deletes the selected languages and revalidates", async () => {
    const result = await deleteLanguagesAction("user-1", [
      "English",
      "German",
    ]);

    expect(result).toEqual({ success: true });
    expect(deleteMyLanguage).toHaveBeenCalledWith(
      { userId: "user-1", name: ["English", "German"] },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/languages");
  });
});
