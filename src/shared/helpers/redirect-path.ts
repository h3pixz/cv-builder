import {
  FORGOT_PASSWORD_ROUTE,
  HOME_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "@/shared/config";

const GUEST_PATHS = [SIGN_IN_ROUTE, SIGN_UP_ROUTE, FORGOT_PASSWORD_ROUTE];

function isGuestPath(path: string) {
  return GUEST_PATHS.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

export function safeRedirectPath(
  value: string | undefined,
  fallback = HOME_ROUTE,
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\") ||
    /[\r\n]/.test(value)
  ) {
    return fallback;
  }

  const path = value.split("?")[0].split("#")[0];

  return isGuestPath(path) ? fallback : value;
}
