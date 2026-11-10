import { request, type RequestDocument, type Variables } from "graphql-request";

export type GraphQLRequestOptions = {
  accessToken?: string;
  origin?: string;
};

function getGraphQLUrl(): string {
  const url = process.env.GRAPHQL_URL;

  if (!url) {
    throw new Error("GRAPHQL_URL is not set");
  }

  return url;
}

export async function gqlRequest<T, V extends Variables = Variables>(
  document: RequestDocument,
  variables?: V,
  options: GraphQLRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  if (options.origin) {
    headers.Origin = options.origin;
  }

  return request<T>(getGraphQLUrl(), document, variables, headers);
}
