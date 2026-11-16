import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parse } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { gqlRequest } from "./graphql";

const fetchMock = vi.fn();

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    text: async () => JSON.stringify(data),
  };
}

// graphql-request accepts a DocumentNode; tests build one from a query string.
function document<TResult>(
  source: string,
): TypedDocumentNode<TResult, Record<string, never>> {
  return parse(source) as unknown as TypedDocumentNode<
    TResult,
    Record<string, never>
  >;
}

beforeEach(() => {
  vi.stubEnv("VITE_GRAPHQL_URL", "http://localhost:3001/api/graphql");
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("gqlRequest", () => {
  it("sends the document to VITE_GRAPHQL_URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await gqlRequest(document("query { ok }"));

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3001/api/graphql");
    expect(JSON.parse(init.body)).toMatchObject({
      query: expect.stringContaining("ok"),
    });
  });

  it("adds authorization and origin headers", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await gqlRequest(document("query { ok }"), undefined, {
      accessToken: "token",
      origin: "http://localhost:3000",
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get("authorization")).toBe("Bearer token");
    expect(init.headers.get("origin")).toBe("http://localhost:3000");
  });

  it("returns the response data", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: { ok: true } }));

    await expect(
      gqlRequest<{ ok: boolean }>(document("query { ok }")),
    ).resolves.toEqual({
      ok: true,
    });
  });

  it("throws when VITE_GRAPHQL_URL is not set", async () => {
    vi.stubEnv("VITE_GRAPHQL_URL", "");

    await expect(gqlRequest(document("query { ok }"))).rejects.toThrow(
      "VITE_GRAPHQL_URL is not set",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
