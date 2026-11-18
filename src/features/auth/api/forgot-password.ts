"use server";

import { getGraphQLErrorMessage, gqlRequest } from "@/shared/api";
import { ForgotPasswordMutation } from "./documents";
import { getRequestOrigin } from "@/shared/api/request-origin";

export type ForgotPasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordResult> {
  try {
    const origin = await getRequestOrigin();

    await gqlRequest(ForgotPasswordMutation, { auth: { email } }, { origin });

    return { success: true };
  } catch (error) {
    return { success: false, error: getGraphQLErrorMessage(error) };
  }
}
