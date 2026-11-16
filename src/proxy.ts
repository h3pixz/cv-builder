// src/proxy.ts
import { NextResponse, type NextRequest } from "next/server";

const ACCESS = "access_token";
const REFRESH = "refresh_token";
const ACCESS_MAX_AGE = 60 * 10;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const GRAPHQL_URL = process.env.VITE_GRAPHQL_URL; // same var as raw-request.ts

type Tokens = { access_token: string; refresh_token: string };

function isExpired(jwt: string, skewSeconds = 30): boolean {
  try {
    const part = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(part));
    return exp - Date.now() / 1000 < skewSeconds;
  } catch {
    return true;
  }
}

async function refreshTokens(refreshToken: string): Promise<Tokens | null> {
  if (!GRAPHQL_URL) {
    console.error("[proxy] VITE_GRAPHQL_URL is not set");
    return null;
  }
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `mutation UpdateToken { updateToken { access_token refresh_token } }`,
      }),
    });
    const json = await res.json();
    if (json.errors?.length)
      console.error("[proxy] refresh failed:", json.errors[0].message);
    return json.data?.updateToken ?? null;
  } catch (e) {
    console.error("[proxy] refresh threw:", e);
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS)?.value;
  const refresh = request.cookies.get(REFRESH)?.value;

  if (access && !isExpired(access)) return NextResponse.next();

  const toLogin = () => {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(ACCESS);
    res.cookies.delete(REFRESH);
    return res;
  };

  if (!refresh) return toLogin();

  const tokens = await refreshTokens(refresh);
  if (!tokens) return toLogin();

  request.cookies.set(ACCESS, tokens.access_token);
  request.cookies.set(REFRESH, tokens.refresh_token);
  const response = NextResponse.next({ request });

  response.cookies.set(ACCESS, tokens.access_token, {
    ...cookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  response.cookies.set(REFRESH, tokens.refresh_token, {
    ...cookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });
  return response;
}

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
