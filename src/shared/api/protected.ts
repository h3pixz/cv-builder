import "server-only";

import { redirect } from "next/navigation";
import { ClientError } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

import { getSession } from "./session";
import { gqlRequest, type GraphQLRequestOptions } from "./index";

function isUnauthenticated(error: unknown): boolean {
  if (!(error instanceof ClientError)) return false;
  const { status, errors } = error.response;
  return (
    status === 401 ||
    errors?.some((e) => e.extensions?.code === "UNAUTHENTICATED") === true
  );
}

export async function protectedRequest<
  TData,
  TVariables extends Record<string, unknown>,
>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  options?: Omit<GraphQLRequestOptions, "accessToken">,
): Promise<TData> {
  const session = await getSession();
  if (!session) redirect("/login");

  try {
    return await gqlRequest(document, variables as TVariables, {
      ...options,
      accessToken: session.access_token,
    });
  } catch (error) {
    if (isUnauthenticated(error)) redirect("/login");
    throw error;
  }
}
