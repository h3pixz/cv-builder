import { cookies } from "next/headers";
import { gqlRequest } from "./graphql/client";
import { UpdateTokenDocument } from "./graphql/documents";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  sessionCookieOptions,
} from "./session-cookies";

export type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

export async function getSession(): Promise<SessionTokens | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { access_token: accessToken, refresh_token: refreshToken };
}

export async function saveSession(tokens: SessionTokens): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    tokens.access_token,
    sessionCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refresh_token,
    sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function refreshSession(): Promise<SessionTokens | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const data = await gqlRequest(UpdateTokenDocument, undefined, {
      accessToken: refreshToken,
    });

    await saveSession(data.updateToken);

    return data.updateToken;
  } catch {
    return null;
  }
}
