import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { config, proxy } from "./proxy";

const { gqlRequest } = vi.hoisted(() => ({ gqlRequest: vi.fn() }));

vi.mock("@/shared/api/graphql/graphql", () => ({ gqlRequest }));

const freshTokens = {
  access_token: "access-2",
  refresh_token: "refresh-2",
};

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function jwt(expiresInSeconds: number) {
  return `${encode({ alg: "none" })}.${encode({
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })}.signature`;
}

function createRequest(path: string, cookies: Record<string, string>) {
  const cookieHeader = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
}

function location(response: Response) {
  const value = response.headers.get("location");
  return value ? new URL(value) : null;
}

beforeEach(() => {
  gqlRequest.mockReset();
});

describe("private routes", () => {
  it("lets a request with a fresh access token through", async () => {
    const response = await proxy(
      createRequest("/cvs", {
        access_token: jwt(60),
        refresh_token: "refresh-1",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("redirects to sign in without a session", async () => {
    const response = await proxy(createRequest("/cvs", {}));

    expect(response.status).toBe(307);
    expect(location(response)?.pathname).toBe("/sign-in");
    expect(location(response)?.searchParams.get("next")).toBe("/cvs");
    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("keeps the query in the next parameter", async () => {
    const response = await proxy(createRequest("/cvs?page=2", {}));

    expect(location(response)?.searchParams.get("next")).toBe("/cvs?page=2");
  });

  it("protects the home page", async () => {
    const response = await proxy(createRequest("/", {}));

    expect(response.status).toBe(307);
    expect(location(response)?.pathname).toBe("/sign-in");
    expect(location(response)?.searchParams.get("next")).toBe("/");
  });

  it("renews tokens with the refresh token", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(
      createRequest("/cvs", { refresh_token: "refresh-1" }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("access-2");
    expect(response.cookies.get("refresh_token")?.value).toBe("refresh-2");
    expect(gqlRequest).toHaveBeenCalledWith(expect.anything(), undefined, {
      accessToken: "refresh-1",
    });
  });

  it("refreshes when the access token has expired", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(
      createRequest("/cvs", {
        access_token: jwt(-1),
        refresh_token: "refresh-1",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("access-2");
    expect(gqlRequest).toHaveBeenCalledOnce();
  });

  it("treats a malformed access token as expired", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(
      createRequest("/cvs", {
        access_token: "not-a-jwt",
        refresh_token: "refresh-1",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("access-2");
    expect(gqlRequest).toHaveBeenCalledOnce();
  });

  it("forwards the renewed tokens to the current request", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(
      createRequest("/cvs", {
        access_token: jwt(-1),
        refresh_token: "refresh-1",
      }),
    );

    const forwardedCookies = response.headers.get(
      "x-middleware-request-cookie",
    );

    expect(forwardedCookies).toContain("access_token=access-2");
    expect(forwardedCookies).toContain("refresh_token=refresh-2");
  });

  it("clears cookies and redirects when the refresh token is invalid", async () => {
    gqlRequest.mockRejectedValueOnce(new Error("invalidRefreshToken"));

    const response = await proxy(
      createRequest("/cvs", { refresh_token: "refresh-1" }),
    );

    expect(response.status).toBe(307);
    expect(location(response)?.pathname).toBe("/sign-in");
    expect(response.cookies.get("access_token")?.value).toBe("");
    expect(response.cookies.get("refresh_token")?.value).toBe("");
  });
});

describe("guest routes", () => {
  it("lets unauthenticated visitors see the sign in page", async () => {
    const response = await proxy(createRequest("/sign-in", {}));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("sends authenticated visitors home", async () => {
    const response = await proxy(
      createRequest("/sign-in", { access_token: jwt(60) }),
    );

    expect(response.status).toBe(307);
    expect(location(response)?.pathname).toBe("/");
  });

  it("refreshes before sending a visitor away from sign up", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(
      createRequest("/sign-up", {
        access_token: jwt(-1),
        refresh_token: "refresh-1",
      }),
    );

    expect(response.status).toBe(307);
    expect(location(response)?.pathname).toBe("/");
    expect(response.cookies.get("access_token")?.value).toBe("access-2");
  });

  it("clears a dead session and shows the sign in page", async () => {
    gqlRequest.mockRejectedValueOnce(new Error("invalidRefreshToken"));

    const response = await proxy(
      createRequest("/sign-in", {
        access_token: jwt(-1),
        refresh_token: "refresh-1",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("");
    expect(response.cookies.get("refresh_token")?.value).toBe("");
  });
});

describe("matcher", () => {
  const [pattern] = config.matcher;
  const matches = (path: string) => new RegExp(`^${pattern}$`).test(path);

  it("covers every app route by default, including ones added later", () => {
    for (const path of [
      "/",
      "/users/1",
      "/departments",
      "/positions",
      "/projects/3",
    ]) {
      expect(matches(path), path).toBe(true);
    }
  });

  it("skips API routes and static assets", () => {
    for (const path of [
      "/api/auth/logout",
      "/_next/static/chunk.js",
      "/_next/image",
      "/favicon.ico",
      "/logo.png",
    ]) {
      expect(matches(path), path).toBe(false);
    }
  });
});
