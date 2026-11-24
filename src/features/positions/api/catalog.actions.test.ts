import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createPosition,
  updatePosition,
  deletePosition,
  findPositionByName,
  isPositionInUse,
  getCurrentUser,
  revalidatePath,
  runAuthed,
} = vi.hoisted(() => ({
  createPosition: vi.fn(),
  updatePosition: vi.fn(),
  deletePosition: vi.fn(),
  findPositionByName: vi.fn(),
  isPositionInUse: vi.fn(),
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
  createPosition,
  updatePosition,
  deletePosition,
}));

vi.mock("./positions.queries", () => ({
  findPositionByName,
  isPositionInUse,
}));

import {
  createPositionAction,
  deletePositionAction,
  updatePositionAction,
} from "./catalog.actions";

const values = { name: "  Developer  " };

beforeEach(() => {
  createPosition.mockReset();
  updatePosition.mockReset();
  deletePosition.mockReset();
  findPositionByName.mockReset();
  isPositionInUse.mockReset();
  getCurrentUser.mockReset();
  revalidatePath.mockReset();
  runAuthed.mockReset();

  getCurrentUser.mockResolvedValue({ id: "user-1", role: "Admin" });
  findPositionByName.mockResolvedValue(null);
  isPositionInUse.mockResolvedValue(false);
  runAuthed.mockImplementation(
    async (operation: (token: string) => Promise<unknown>) => ({
      success: true,
      data: await operation("token"),
    }),
  );
});

describe("createPositionAction", () => {
  it("rejects invalid input before checking the role", async () => {
    const result = await createPositionAction({ name: "" });

    expect(result).toEqual({
      success: false,
      error: "Position name is required",
      code: null,
      field: "name",
    });
    expect(getCurrentUser).not.toHaveBeenCalled();
    expect(createPosition).not.toHaveBeenCalled();
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await createPositionAction(values);

    expect(result).toEqual({
      success: false,
      error: "You do not have permission to perform this action",
      code: "insufficientPermissions",
    });
    expect(createPosition).not.toHaveBeenCalled();
  });

  it("returns an inline error when the name already exists", async () => {
    findPositionByName.mockResolvedValue({
      id: "position-1",
      name: "Developer",
    });

    const result = await createPositionAction(values);

    expect(result).toEqual({
      success: false,
      error: "Position already exists",
      code: null,
      field: "name",
    });
    expect(createPosition).not.toHaveBeenCalled();
  });

  it("creates the position and revalidates the catalog", async () => {
    const result = await createPositionAction(values);

    expect(result).toEqual({ success: true });
    expect(findPositionByName).toHaveBeenCalledWith("Developer", {
      accessToken: "token",
    });
    expect(createPosition).toHaveBeenCalledWith(
      { name: "Developer" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/positions");
    expect(revalidatePath).toHaveBeenCalledWith("/users");
  });
});

describe("updatePositionAction", () => {
  it("excludes the edited position from the duplicate check", async () => {
    const result = await updatePositionAction("position-1", values);

    expect(result).toEqual({ success: true });
    expect(findPositionByName).toHaveBeenCalledWith("Developer", {
      accessToken: "token",
      excludeId: "position-1",
    });
    expect(updatePosition).toHaveBeenCalledWith(
      { positionId: "position-1", name: "Developer" },
      { accessToken: "token" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/positions");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await updatePositionAction("position-1", values);

    expect(result.success).toBe(false);
    expect(updatePosition).not.toHaveBeenCalled();
  });
});

describe("deletePositionAction", () => {
  it("refuses to delete a position that is in use", async () => {
    isPositionInUse.mockResolvedValue(true);

    const result = await deletePositionAction("position-1");

    expect(result).toEqual({
      success: false,
      error: "Position cannot be deleted because it is currently in use",
      code: null,
    });
    expect(deletePosition).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("deletes the position and revalidates the catalog", async () => {
    const result = await deletePositionAction("position-1");

    expect(result).toEqual({ success: true });
    expect(isPositionInUse).toHaveBeenCalledWith("position-1", {
      accessToken: "token",
    });
    expect(deletePosition).toHaveBeenCalledWith("position-1", {
      accessToken: "token",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/positions");
  });

  it("forbids non-admin users", async () => {
    getCurrentUser.mockResolvedValue({ id: "user-1", role: "Employee" });

    const result = await deletePositionAction("position-1");

    expect(result.success).toBe(false);
    expect(deletePosition).not.toHaveBeenCalled();
  });
});
