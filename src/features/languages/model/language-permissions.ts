export const LANGUAGE_ROLES = ["Admin", "Employee"] as const;

export type LanguageRole = (typeof LANGUAGE_ROLES)[number];

/** The global language catalog is managed by Admins only. */
export function canManageLanguageCatalog(
  role: LanguageRole | null | undefined,
): boolean {
  return role === "Admin";
}
