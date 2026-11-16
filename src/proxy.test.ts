// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// proxy reads the endpoint at module load, so the env must be set first.
const { fetchMock } = vi.hoisted(() => {
  process.env.VITE_GRAPHQL_URL = "http://localhost:3001/api/graphql";
  return { fetchMock: vi.fn() };
});

import { NextRequest } from "next/server";
import { proxy } from "./proxy";

const ACCESS = "access_token";
const REFRESH = "refresh_token";

function jwt(exp: number | undefined): string {
  const payload = Buffer.from(JSON.stringify(exp === undefined ? {} : { exp })).toString(
    "base64url",
  );
  return `header.${payload}.signature`;
}

function futureExp() {
  return Math.floor(Date.now() / 1000) + 60 * 60;
}

function request(cookies: Record<string, string>) {
  const cookie = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  return new NextRequest("http://localhost:3000/users/1", {
    headers: cookie ? { cookie } : undefined,
  });
}

function refreshResponse(tokens: { access_token: string; refresh_token: string }) {
  return {
    status: 200,
    json: async () => ({ data: { updateToken: tokens } }),
  } as unknown as Response;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("proxy", () => {
  it("lets a request with a valid access token through", async () => {
    const response = await proxy(request({ [ACCESS]: jwt(futureExp()) }));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("redirects to /login and clears cookies when there is no session", async () => {
    const response = await proxy(request({}));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    expect(response.cookies.get(ACCESS)?.value).toBe("");
    expect(response.cookies.get(REFRESH)?.value).toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("treats an expired access token as missing", async () => {
    const response = await proxy(
      request({ [ACCESS]: jwt(Math.floor(Date.now() / 1000) - 60) }),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("treats a malformed token as expired", async () => {
    const response = await proxy(request({ [ACCESS]: "not-a-jwt" }));

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("refreshes an expired access token with the refresh token", async () => {
    const fresh = { access_token: "access-2", refresh_token: "refresh-2" };
    fetchMock.mockResolvedValueOnce(refreshResponse(fresh));

    const response = await proxy(
      request({
        [ACCESS]: jwt(Math.floor(Date.now() / 1000) - 60),
        [REFRESH]: "refresh-1",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.cookies.get(ACCESS)?.value).toBe("access-2");
    expect(response.cookies.get(REFRESH)?.value).toBe("refresh-2");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer refresh-1");
    expect(JSON.parse(init.body).query).toContain("mutation UpdateToken");
  });

  it("refreshes when the access cookie is absent but a refresh token exists", async () => {
    fetchMock.mockResolvedValueOnce(
      refreshResponse({ access_token: "access-2", refresh_token: "refresh-2" }),
    );

    const response = await proxy(request({ [REFRESH]: "refresh-1" }));

    expect(response.status).toBe(200);
    expect(response.cookies.get(ACCESS)?.value).toBe("access-2");
  });

  it("redirects to /login when the refresh request fails", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ errors: [{ message: "invalid token" }] }),
    } as unknown as Response);

    const response = await proxy(
      request({ [REFRESH]: "refresh-1" }),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    expect(response.cookies.get(ACCESS)?.value).toBe("");
    expect(response.cookies.get(REFRESH)?.value).toBe("");
  });

  it("redirects to /login when the refresh request throws", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network"));

    const response = await proxy(request({ [REFRESH]: "refresh-1" }));

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
