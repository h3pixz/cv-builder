import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// raw-request reads the endpoint at module load, so the env must be set first.
const { fetchMock } = vi.hoisted(() => {
  process.env.VITE_GRAPHQL_URL = "http://localhost:3001/api/graphql";
  return { fetchMock: vi.fn() };
});

import { authedRequest, loginRequest, refreshRequest } from "./raw-request";

const tokens = { access_token: "access-1", refresh_token: "refresh-1" };

function jsonResponse(body: unknown, status = 200) {
  return { status, json: async () => body } as unknown as Response;
}

async function captureError(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error as Error & { unauthenticated?: boolean };
  }
  throw new Error("Expected the request to reject");
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loginRequest", () => {
  it("sends the credentials without an authorization header", async () => {
    const login = {
      ...tokens,
      user: { id: "user-1", email: "user@example.com", role: "Employee" },
    };
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { login } }));

    await expect(
      loginRequest({ email: "user@example.com", password: "secret" }),
    ).resolves.toEqual(login);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3001/api/graphql");
    expect(init.method).toBe("POST");
    expect(init.cache).toBe("no-store");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toBeUndefined();

    const body = JSON.parse(init.body);
    expect(body.query).toContain("mutation Login");
    expect(body.variables).toEqual({
      auth: { email: "user@example.com", password: "secret" },
    });
  });
});

describe("refreshRequest", () => {
  it("sends the refresh token as the bearer token", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { updateToken: tokens } }));

    await expect(refreshRequest("refresh-1")).resolves.toEqual(tokens);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer refresh-1");
    expect(JSON.parse(init.body).query).toContain("mutation UpdateToken");
  });
});

describe("authedRequest", () => {
  it("sends the access token and variables", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await expect(
      authedRequest<{ ok: boolean }>("query { ok }", { id: "1" }, "access-1"),
    ).resolves.toEqual({ ok: true });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer access-1");
    expect(JSON.parse(init.body).variables).toEqual({ id: "1" });
  });

  it("treats a 401 response as unauthenticated", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 401));

    const error = await captureError(authedRequest("query", undefined, "old"));

    expect(error.message).toBe("Unauthorized");
    expect(error.unauthenticated).toBe(true);
  });

  it.each(["UNAUTHORIZED", "UNAUTHENTICATED"])(
    "treats the %s error code as unauthenticated",
    async (code) => {
      fetchMock.mockResolvedValueOnce(
        jsonResponse({ errors: [{ message: "denied", extensions: { code } }] }),
      );

      const error = await captureError(
        authedRequest("query", undefined, "old"),
      );

      expect(error.message).toBe("denied");
      expect(error.unauthenticated).toBe(true);
    },
  );

  it("detects an unauthenticated status inside the original error", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        errors: [
          { message: "denied", extensions: { originalError: { statusCode: 401 } } },
        ],
      }),
    );

    const error = await captureError(authedRequest("query", undefined, "old"));

    expect(error.unauthenticated).toBe(true);
  });

  it("detects token-related error messages", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ errors: [{ message: "jwt expired" }] }),
    );

    const error = await captureError(authedRequest("query", undefined, "old"));

    expect(error.unauthenticated).toBe(true);
  });

  it("keeps regular GraphQL errors marked as authenticated", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ errors: [{ message: "invalid input" }] }),
    );

    const error = await captureError(authedRequest("query", undefined, "tok"));

    expect(error.message).toBe("invalid input");
    expect(error.unauthenticated).toBe(false);
  });
});
