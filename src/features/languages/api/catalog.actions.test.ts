import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createLanguage,
  updateLanguage,
  deleteLanguage,
  findLanguageByName,
  findLanguageByIso,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createLanguage: vi.fn(),
  updateLanguage: vi.fn(),
  deleteLanguage: vi.fn(),
  findLanguageByName: vi.fn(),
  findLanguageByIso: vi.fn(),
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
  createLanguage,
  updateLanguage,
  deleteLanguage,
}));

vi.mock("./languages.queries", () => ({
  findLanguageByName,
  findLanguageByIso,
}));

import {
  createLanguageAction,
  deleteLanguageAction,
  updateLanguageAction,
} from "./catalog.actions";

const values = {
  name: "  English  ",
  iso2: "en",
  nativeName: "English",
};

beforeEach(() => {
  createLanguage.mockReset();
  updateLanguage.mockReset();
  deleteLanguage.mockReset();
  findLanguageByName.mockReset();
  findLanguageByIso.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Admin" });
  findLanguageByName.mockResolvedValue(null);
  findLanguageByIso.mockResolvedValue(null);
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createLanguageAction", () => {
  it("rejects invalid input before checking the role", async () => {
    const result = await createLanguageAction({
      name: "",
      iso2: "",
      nativeName: "",
    });

    expect(result).toEqual({
      success: false,
      error: "Name is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createLanguage).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await createLanguageAction(values);

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(createLanguage).not.toHaveBeenCalled();
  });

  it("returns an inline error when the name already exists", async () => {
    findLanguageByName.mockResolvedValue({ id: "language-1", name: "English" });

    const result = await createLanguageAction(values);

    expect(result).toEqual({
      success: false,
      error: "Language already exists",
      code: null,
      field: "name",
    });
    expect(createLanguage).not.toHaveBeenCalled();
  });

  it("returns an inline error when the ISO code already exists", async () => {
    findLanguageByIso.mockResolvedValue({ id: "language-1", iso2: "EN" });

    const result = await createLanguageAction(values);

    expect(result).toEqual({
      success: false,
      error: "ISO code already exists",
      code: null,
      field: "iso2",
    });
    expect(createLanguage).not.toHaveBeenCalled();
  });

  it("creates the language with an uppercase ISO and revalidates", async () => {
    const result = await createLanguageAction(values);

    expect(result).toEqual({ success: true });
    expect(findLanguageByName).toHaveBeenCalledWith("English", {
      accessToken: "token",
    });
    expect(findLanguageByIso).toHaveBeenCalledWith("EN", {
      accessToken: "token",
    });
    expect(createLanguage).toHaveBeenCalledWith(
      { name: "English", iso2: "EN", native_name: "English" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/languages");
    expect(revalidatePath).toHaveBeenCalledWith("/languages");
  });
});

describe("updateLanguageAction", () => {
  it("excludes the edited language from both duplicate checks", async () => {
    const result = await updateLanguageAction("language-1", values);

    expect(result).toEqual({ success: true });
    expect(findLanguageByName).toHaveBeenCalledWith("English", {
      accessToken: "token",
      excludeId: "language-1",
    });
    expect(findLanguageByIso).toHaveBeenCalledWith("EN", {
      accessToken: "token",
      excludeId: "language-1",
    });
    expect(updateLanguage).toHaveBeenCalledWith(
      {
        languageId: "language-1",
        name: "English",
        iso2: "EN",
        native_name: "English",
      },
      { accessToken: "token" },
    );
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await updateLanguageAction("language-1", values);

    expect(result.success).toBe(false);
    expect(updateLanguage).not.toHaveBeenCalled();
  });
});

describe("deleteLanguageAction", () => {
  it("deletes the language and revalidates the catalog", async () => {
    const result = await deleteLanguageAction("language-1");

    expect(result).toEqual({ success: true });
    expect(deleteLanguage).toHaveBeenCalledWith("language-1", {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/languages");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await deleteLanguageAction("language-1");

    expect(result.success).toBe(false);
    expect(deleteLanguage).not.toHaveBeenCalled();
  });
});
