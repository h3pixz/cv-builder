export const LANGUAGE_ROLES = ["Admin", "Employee"] as const;

export type LanguageRole = (typeof LANGUAGE_ROLES)[number];

export function canManageLanguageCatalog(
  role: LanguageRole | null | undefined,
): boolean {
  return role === "Admin";
}
