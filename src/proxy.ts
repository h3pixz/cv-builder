import { NextResponse, type NextRequest } from "next/server";
import { gqlRequest } from "@/shared/api/graphql";
import { UpdateTokenDocument } from "@/shared/api/graphql/documents";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
  sessionCookieOptions,
} from "@/shared/api/session-cookies";

const SIGN_IN_URL = "/sign-in";

function redirectToSignIn(request: NextRequest) {
  const response = NextResponse.redirect(new URL(SIGN_IN_URL, request.url));

  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);

  return response;
}

export async function proxy(request: NextRequest) {
  if (request.cookies.get(ACCESS_TOKEN_COOKIE)?.value) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return redirectToSignIn(request);
  }

  try {
    const data = await gqlRequest(UpdateTokenDocument, undefined, {
      accessToken: refreshToken,
    });
    const response = NextResponse.next();

    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      data.updateToken.access_token,
      sessionCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      data.updateToken.refresh_token,
      sessionCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return response;
  } catch {
    return redirectToSignIn(request);
  }
}

export const config = {
  matcher: [
    "/users/:path*",
    "/profile/:path*",
    "/cvs/:path*",
    "/skills/:path*",
    "/languages/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
};
