export const LANGUAGE_STORAGE_KEY = "language";

export const APP_LANGUAGES = [
  "en",
  "fr",
  "de",
  "it",
  "pl",
  "pt",
  "ru",
  "es",
  "uk",
] as const;

export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = "en";

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  fr: "French",
  de: "German",
  it: "Italian",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  uk: "Ukrainian",
};

export const LANGUAGE_OPTIONS: { value: AppLanguage; label: string }[] =
  APP_LANGUAGES.map((value) => ({ value, label: LANGUAGE_LABELS[value] }));

export function isAppLanguage(
  value: string | null | undefined,
): value is AppLanguage {
  return (
    typeof value === "string" &&
    (APP_LANGUAGES as readonly string[]).includes(value)
  );
}

export function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isAppLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function storeLanguage(language: AppLanguage): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // See storeTheme: persistence is best-effort on the client.
  }
}
