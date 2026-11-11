import { cookies } from "next/headers";
import { gqlRequest } from "./graphql/client";

export type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const ACCESS_TOKEN_MAX_AGE = 60 * 10;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

const UPDATE_TOKEN_MUTATION = `
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

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
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...options,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
    ...options,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function refreshSession(): Promise<SessionTokens | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const data = await gqlRequest<{ updateToken: SessionTokens }>(
      UPDATE_TOKEN_MUTATION,
      undefined,
      { accessToken: session.refresh_token },
    );

    await saveSession(data.updateToken);

    return data.updateToken;
  } catch {
    return null;
  }
}
