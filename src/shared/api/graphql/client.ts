import { request, type RequestDocument, type Variables } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { getGraphQLUrl } from "@/shared/config";

export type GraphQLRequestOptions = {
  accessToken?: string;
  origin?: string;
};

export function gqlRequest<TResult, TVariables extends Variables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: GraphQLRequestOptions,
): Promise<TResult>;
export function gqlRequest<T, V extends Variables = Variables>(
  document: RequestDocument,
  variables?: V,
  options?: GraphQLRequestOptions,
): Promise<T>;
export async function gqlRequest(
  document: RequestDocument,
  variables?: Variables,
  options: GraphQLRequestOptions = {},
): Promise<unknown> {
  const headers: Record<string, string> = {};

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  if (options.origin) {
    headers.Origin = options.origin;
  }

  return request(getGraphQLUrl(), document, variables, headers);
}
