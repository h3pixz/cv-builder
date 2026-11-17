import { redirect } from "next/navigation";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "graphql-request";
import { SIGN_IN_ROUTE } from "@/shared/config";
import { gqlRequest, type GraphQLRequestOptions } from "./client";
import { isUnauthorizedError } from "./errors";
import { clearSession, getSession, refreshSession } from "../session";

type AuthedRequestOptions = Omit<GraphQLRequestOptions, "accessToken">;

async function sendWithAccessToken<TResult, TVariables extends Variables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables | undefined,
  accessToken: string,
  options: AuthedRequestOptions,
): Promise<TResult> {
  return gqlRequest(document, variables, { ...options, accessToken });
}

export async function authedGqlRequest<TResult, TVariables extends Variables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options: AuthedRequestOptions = {},
): Promise<TResult> {
  const session = await getSession();

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  try {
    return await sendWithAccessToken(
      document,
      variables,
      session.access_token,
      options,
    );
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirect(SIGN_IN_ROUTE);
    }

    throw error;
  }
}

export async function authedGqlRequestWithRefresh<
  TResult,
  TVariables extends Variables,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options: AuthedRequestOptions = {},
): Promise<TResult> {
  const session = await getSession();

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  try {
    return await sendWithAccessToken(
      document,
      variables,
      session.access_token,
      options,
    );
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error;
    }
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    await clearSession();
    redirect(SIGN_IN_ROUTE);
  }

  try {
    return await sendWithAccessToken(
      document,
      variables,
      refreshed.access_token,
      options,
    );
  } catch (error) {
    if (isUnauthorizedError(error)) {
      await clearSession();
      redirect(SIGN_IN_ROUTE);
    }

    throw error;
  }
}
