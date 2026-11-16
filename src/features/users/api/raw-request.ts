import "server-only";

const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL!;

export type Tokens = { access_token: string; refresh_token: string };
export type Credentials = { email: string; password: string };

const LOGIN = /* GraphQL */ `
  mutation Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
        role
      }
    }
  }
`;

const UPDATE_TOKEN = /* GraphQL */ `
  mutation UpdateToken {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

class GqlError extends Error {
  constructor(
    message: string,
    public unauthenticated: boolean,
  ) {
    super(message);
  }
}

async function rawRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 401) throw new GqlError("Unauthorized", true);

  const json = await res.json();
  if (json.errors?.length) {
    const e = json.errors[0];
    const unauth =
      e.extensions?.code === "UNAUTHORIZED" ||
      e.extensions?.code === "UNAUTHENTICATED" ||
      e.extensions?.originalError?.statusCode === 401 ||
      /unauthor|jwt|token/i.test(e.message ?? "");
    throw new GqlError(e.message, unauth);
  }
  return json.data as T;
}

/** 1. Login with email + password */
export async function loginRequest(creds: Credentials) {
  const data = await rawRequest<{
    login: Tokens & { user: { id: string; email: string; role: string } };
  }>(LOGIN, { auth: creds });
  return data.login;
}

/** 2. Refresh. Assumes your backend reads the refresh token from the Bearer header. */
export async function refreshRequest(refreshToken: string): Promise<Tokens> {
  const data = await rawRequest<{ updateToken: Tokens }>(
    UPDATE_TOKEN,
    undefined,
    refreshToken,
  );
  return data.updateToken;
}

/**
 * 3. Authenticated request with automatic re-auth.
 *    Returns the data and, if tokens were renewed, the new tokens for the caller to persist.
 */
export async function authedRequest<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  accessToken: string,
): Promise<T> {
  try {
    return await rawRequest<T>(query, variables, accessToken);
  } catch (err) {
    if (err instanceof GqlError && err.unauthenticated) {
      // proxy.ts refreshes expired tokens before render, so reaching this
      // means the session is really dead (revoked token, backend restart)
      //redirect("/login");
    }
    throw err;
  }
}
