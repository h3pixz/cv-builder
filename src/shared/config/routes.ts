export const HOME_ROUTE = "/";
export const SIGN_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const VERIFY_EMAIL_ROUTE = "/verify-email";

export const GUEST_ROUTES = [
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  FORGOT_PASSWORD_ROUTE,
] as const;
