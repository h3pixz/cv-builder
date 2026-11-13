import { beforeEach, describe, expect, it, vi } from "vitest";
import { logout } from "./logout";

const { clearSession, redirect } = vi.hoisted(() => ({
  clearSession: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/shared/api/session", () => ({ clearSession }));
vi.mock("next/navigation", () => ({ redirect }));

beforeEach(() => {
  clearSession.mockReset();
  redirect.mockReset();
});

describe("logout", () => {
  it("clears the session and redirects to sign in", async () => {
    await logout();

    expect(clearSession).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});
