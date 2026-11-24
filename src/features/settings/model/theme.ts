import { THEME_STORAGE_KEY } from "@/shared/config/theme-script";

export { THEME_STORAGE_KEY };

export const THEMES = ["light", "dark", "device"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "device";

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "device", label: "Device settings" },
];

export function isTheme(value: string | null | undefined): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

function prefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** The concrete theme a selection resolves to when the device preference is taken into account. */
export function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "device" ? (prefersDark() ? "dark" : "light") : theme;
}

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme: Theme): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the theme
    // still applies for the current session.
  }
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", resolveTheme(theme) === "dark");
}
