"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import {
  applyTheme,
  DEFAULT_THEME,
  readStoredTheme,
  storeTheme,
  type Theme,
} from "../model/theme";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    readStoredTheme,
    getServerSnapshot,
  );

  const setTheme = useCallback((next: Theme) => {
    storeTheme(next);
    applyTheme(next);
    emit();
  }, []);

  useEffect(() => {
    if (theme !== "device") {
      return;
    }

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("device");

    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  return { theme, setTheme };
}
