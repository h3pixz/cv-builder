import "server-only";

import { headers } from "next/headers";

/** Public origin of the current request, needed for links the backend puts in emails. */
export async function getRequestOrigin(): Promise<string | undefined> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return undefined;
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return `${protocol}://${host}`;
}
