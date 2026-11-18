import { NextResponse, type NextRequest } from "next/server";
import { gqlRequest } from "@/shared/api/graphql/graphql";
import { UpdateTokenDocument } from "@/shared/api/documents/documents";
import { isTokenExpired } from "@/shared/api/jwt/jwt";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  ACCESS_TOKEN_REFRESH_SKEW,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  sessionCookieOptions,
} from "@/shared/api/session-cookies/session-cookies";
import { GUEST_ROUTES, HOME_ROUTE, SIGN_IN_ROUTE } from "@/shared/config";

type Tokens = { access_token: string; refresh_token: string };

function isGuestRoute(pathname: string) {
  return GUEST_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}

function persistTokens(response: NextResponse, tokens: Tokens) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.access_token,
    sessionCookieOptions(ACCESS_TOKEN_MAX_AGE),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refresh_token,
    sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
  );
}

async function refreshTokens(refreshToken: string): Promise<Tokens | null> {
  try {
    const data = await gqlRequest(UpdateTokenDocument, undefined, {
      accessToken: refreshToken,
    });

    return data.updateToken;
  } catch {
    return null;
  }
}

function redirectToSignIn(request: NextRequest) {
  const url = new URL(SIGN_IN_ROUTE, request.url);
  const { pathname, search } = request.nextUrl;

  url.searchParams.set("next", `${pathname}${search}`);

  const response = NextResponse.redirect(url);
  clearSessionCookies(response);

  return response;
}

function redirectHome(request: NextRequest) {
  return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
}

function nextWithTokens(request: NextRequest, tokens: Tokens) {
  request.cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token);
  request.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token);

  const response = NextResponse.next({ request });
  persistTokens(response, tokens);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const hasFreshAccessToken = accessToken
    ? !isTokenExpired(accessToken, ACCESS_TOKEN_REFRESH_SKEW)
    : false;

  if (isGuestRoute(pathname)) {
    if (hasFreshAccessToken) {
      return redirectHome(request);
    }

    if (refreshToken) {
      const tokens = await refreshTokens(refreshToken);
      if (tokens) return nextWithTokens(request, tokens);
    }

    const response = NextResponse.next();

    if (accessToken || refreshToken) {
      clearSessionCookies(response);
    }

    return response;
  }

  if (hasFreshAccessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    const tokens = await refreshTokens(refreshToken);

    if (tokens) {
      const response = NextResponse.next();
      persistTokens(response, tokens);
      return response;
    }
  }

  return redirectToSignIn(request);
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-email",
    "/users/:path*",
    "/profile/:path*",
    "/cvs/:path*",
    "/skills/:path*",
    "/languages/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
};
