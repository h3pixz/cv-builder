import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { gqlRequest } from "./client";

const fetchMock = vi.fn();

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(data),
  };
}

beforeEach(() => {
  vi.stubEnv("GRAPHQL_URL", "http://localhost:3001/api/graphql");
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("gqlRequest", () => {
  it("sends the document to GRAPHQL_URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await gqlRequest("query { ok }");

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3001/api/graphql");
    expect(JSON.parse(init.body)).toMatchObject({
      query: expect.stringContaining("ok"),
    });
  });

  it("adds authorization and origin headers", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await gqlRequest("query { ok }", undefined, {
      accessToken: "token",
      origin: "http://localhost:3000",
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get("authorization")).toBe("Bearer token");
    expect(init.headers.get("origin")).toBe("http://localhost:3000");
  });

  it("returns the response data", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await expect(gqlRequest<{ ok: boolean }>("query { ok }")).resolves.toEqual({
      ok: true,
    });
  });

  it("throws when GRAPHQL_URL is not set", async () => {
    vi.stubEnv("GRAPHQL_URL", "");

    await expect(gqlRequest("query { ok }")).rejects.toThrow(
      "GRAPHQL_URL is not set",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
