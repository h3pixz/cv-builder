export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";
export const ACCESS_TOKEN_MAX_AGE = 60 * 10;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
