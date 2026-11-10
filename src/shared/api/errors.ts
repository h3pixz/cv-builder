export const ERROR_MESSAGES = {
  invalidCredentials: "Неверная почта или пароль",
  userAlreadyExists: "Эта почта уже занята",
  confirmPasswordMismatch: "Пароли не совпадают",
  passwordTooShort: "Пароль слишком короткий",
  confirmPasswordTooShort: "Пароль слишком короткий",
  passwordIsRequired: "Введите пароль",
  invalidEmail: "Некорректная почта",
  otpIsRequired: "Введите код из письма",
  shouldBe6Digits: "Код должен состоять из 6 цифр",
  mailNotFound: "Неверный или устаревший код",
  actionExpired: "Срок действия ссылки истёк",
  failedToSendEmail: "Не удалось отправить письмо",
  unauthorized: "Сессия истекла, войдите снова",
  invalidRefreshToken: "Сессия истекла, войдите снова",
  insufficientPermissions: "Недостаточно прав",
} as const;

export type GraphQLErrorCode = keyof typeof ERROR_MESSAGES;

const DEFAULT_ERROR_MESSAGE = "Что-то пошло не так. Попробуйте позже";

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
