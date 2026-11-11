import { request, type RequestDocument, type Variables } from "graphql-request";
import { getGraphQLUrl } from "@/shared/config";

export type GraphQLRequestOptions = {
  accessToken?: string;
  origin?: string;
};

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
