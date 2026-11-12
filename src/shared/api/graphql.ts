import { request } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

export type GraphQLRequestOptions = {
  accessToken?: string;
  origin?: string;
};

function getGraphQLUrl(): string {
  const url = process.env.VITE_GRAPHQL_URL;

  if (!url) {
    throw new Error("GRAPHQL_URL is not set");
  }

  return url;
}

export async function gqlRequest<
  TResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TVariables extends Record<string, any>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options: GraphQLRequestOptions = {},
): Promise<TResult> {
  const headers: Record<string, string> = {};

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  if (options.origin) {
    headers.Origin = options.origin;
  }

  return request<TResult>({
    url: getGraphQLUrl(),
    document,
    variables,
    requestHeaders: headers,
  });
}
