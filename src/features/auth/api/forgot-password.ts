"use server"

import { headers } from "next/headers"
import { gqlRequest, getGraphQLErrorMessage } from "@/shared/api/graphql"

const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`

export type ForgotPasswordResult =
  | { success: true }
  | { success: false; error: string }

async function getRequestOrigin(): Promise<string | undefined> {
  const requestHeaders = await headers()
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")

  if (!host) {
    return undefined
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http")

  return `${protocol}://${host}`
}

export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordResult> {
  try {
    const origin = await getRequestOrigin()

    await gqlRequest(
      FORGOT_PASSWORD_MUTATION,
      { auth: { email } },
      { origin },
    )

    return { success: true }
  } catch (error) {
    return { success: false, error: getGraphQLErrorMessage(error) }
  }
}
