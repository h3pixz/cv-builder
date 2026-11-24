"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  DEFAULT_LANGUAGE,
  readStoredLanguage,
  storeLanguage,
  type AppLanguage,
} from "../model/language";

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

function getServerSnapshot(): AppLanguage {
  return DEFAULT_LANGUAGE;
}

export function useLanguage() {
  const language = useSyncExternalStore(
    subscribe,
    readStoredLanguage,
    getServerSnapshot,
  );

  const setLanguage = useCallback((next: AppLanguage) => {
    storeLanguage(next);
    emit();
  }, []);

  return { language, setLanguage };
}
