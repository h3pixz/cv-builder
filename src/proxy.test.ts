import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

const { gqlRequest } = vi.hoisted(() => ({ gqlRequest: vi.fn() }));

vi.mock("@/shared/api/graphql", () => ({ gqlRequest }));

const freshTokens = {
  access_token: "access-2",
  refresh_token: "refresh-2",
};

function createRequest(cookies: Record<string, string>) {
  const cookieHeader = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");

  return new NextRequest("http://localhost:3000/cvs", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
}

beforeEach(() => {
  gqlRequest.mockReset();
});

describe("proxy", () => {
  it("lets a request with an access token through", async () => {
    const response = await proxy(
      createRequest({ access_token: "access-1", refresh_token: "refresh-1" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(gqlRequest).not.toHaveBeenCalled();
  });

  it("redirects to sign in without a session", async () => {
    const response = await proxy(createRequest({}));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/sign-in");
  });

  it("renews tokens with the refresh token", async () => {
    gqlRequest.mockResolvedValueOnce({ updateToken: freshTokens });

    const response = await proxy(createRequest({ refresh_token: "refresh-1" }));

    expect(response.status).toBe(200);
    expect(response.cookies.get("access_token")?.value).toBe("access-2");
    expect(response.cookies.get("refresh_token")?.value).toBe("refresh-2");
    expect(gqlRequest).toHaveBeenCalledWith(expect.anything(), undefined, {
      accessToken: "refresh-1",
    });
  });

  it("clears cookies and redirects when the refresh token is invalid", async () => {
    gqlRequest.mockRejectedValueOnce(new Error("invalidRefreshToken"));

    const response = await proxy(createRequest({ refresh_token: "refresh-1" }));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/sign-in");
    expect(response.cookies.get("access_token")?.value).toBe("");
    expect(response.cookies.get("refresh_token")?.value).toBe("");
  });
});
