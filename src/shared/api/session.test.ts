import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSession,
  getSession,
  refreshSession,
  saveSession,
} from "./session";

const { cookieStore, gqlRequest } = vi.hoisted(() => {
  const store = new Map<string, string>();

  return {
    cookieStore: {
      get: (name: string) => {
        const value = store.get(name);
        return value === undefined ? undefined : { name, value };
      },
      set: (name: string, value: string) => {
        store.set(name, value);
      },
      delete: (name: string) => {
        store.delete(name);
      },
    },
    gqlRequest: vi.fn(),
  };
});

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("./graphql", () => ({ gqlRequest }));

const tokens = {
  access_token: "access-1",
  refresh_token: "refresh-1",
};

beforeEach(() => {
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  gqlRequest.mockReset();
});

describe("session", () => {
  it("returns null without cookies", async () => {
    await expect(getSession()).resolves.toBeNull();
  });

  it("saves and reads tokens", async () => {
    await saveSession(tokens);

    await expect(getSession()).resolves.toEqual(tokens);
  });

  it("clears tokens", async () => {
    await saveSession(tokens);

    await clearSession();

    await expect(getSession()).resolves.toBeNull();
  });
});

describe("refreshSession", () => {
  it("requests new tokens with the refresh token", async () => {
    await saveSession(tokens);
    const fresh = { access_token: "access-2", refresh_token: "refresh-2" };
    gqlRequest.mockResolvedValueOnce({ updateToken: fresh });

    await expect(refreshSession()).resolves.toEqual(fresh);

    expect(gqlRequest).toHaveBeenCalledWith(
      expect.stringContaining("UpdateToken"),
      undefined,
      { accessToken: "refresh-1" },
    );
    await expect(getSession()).resolves.toEqual(fresh);
  });

  it("returns null without a session", async () => {
    await expect(refreshSession()).resolves.toBeNull();

    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("returns null when the request fails", async () => {
    await saveSession(tokens);
    gqlRequest.mockRejectedValueOnce(new Error("invalidRefreshToken"));

    await expect(refreshSession()).resolves.toBeNull();
  });
});
