export const ERROR_MESSAGES = {
  invalidCredentials: "Invalid email or password",
  userAlreadyExists: "An account with this email already exists",
  confirmPasswordMismatch: "Passwords do not match",
  passwordTooShort: "Password must be at least 6 characters long",
  confirmPasswordTooShort: "Password must be at least 6 characters long",
  passwordIsRequired: "Password is required",
  invalidEmail: "Please enter a valid email address",
  otpIsRequired: "Verification code is required",
  shouldBe6Digits: "Please enter a valid 6-digit code",
  mailNotFound: "Invalid verification code",
  actionExpired: "This password reset link has expired",
  failedToSendEmail: "Unable to send the email. Please try again later",
  unauthorized: "Your session has expired. Please sign in again",
  invalidRefreshToken: "Your session has expired. Please sign in again",
  insufficientPermissions: "You do not have permission to perform this action",
} as const;

export type GraphQLErrorCode = keyof typeof ERROR_MESSAGES;

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again later";

type ClientErrorLike = {
  response?: {
    errors?: Array<{ message?: string }>;
  };
};

function isGraphQLErrorCode(value: string): value is GraphQLErrorCode {
  return value in ERROR_MESSAGES;
}

export function getGraphQLErrorCode(error: unknown): GraphQLErrorCode | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const code = (error as ClientErrorLike).response?.errors?.[0]?.message;

  if (!code || !isGraphQLErrorCode(code)) {
    return null;
  }

  return code;
}

export function getGraphQLErrorMessage(
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
): string {
  const code = getGraphQLErrorCode(error);

  return code ? ERROR_MESSAGES[code] : fallback;
}
