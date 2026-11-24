"use client";

import { SelectField } from "@/shared/ui/select";

import { LANGUAGE_OPTIONS, isAppLanguage } from "../model/language";
import { THEME_OPTIONS, isTheme } from "../model/theme";
import { ChangePasswordForm } from "./change-password-form";
import { useLanguage } from "./use-language";
import { useTheme } from "./use-theme";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-[850px] flex-col">
      <h1 className="text-lg font-semibold text-foreground">Settings</h1>

      <div className="mt-8 flex flex-col gap-10">
        <SelectField
          id="settings-theme"
          name="theme"
          ariaLabel="Theme"
          label="Theme"
          options={THEME_OPTIONS}
          value={theme}
          onValueChange={(value) => {
            if (isTheme(value)) {
              setTheme(value);
            }
          }}
        />

        <SelectField
          id="settings-language"
          name="language"
          ariaLabel="Language"
          label="Language"
          options={LANGUAGE_OPTIONS}
          value={language}
          onValueChange={(value) => {
            if (isAppLanguage(value)) {
              setLanguage(value);
            }
          }}
        />

        <section
          aria-labelledby="settings-change-password"
          className="flex flex-col gap-6"
        >
          <h2
            id="settings-change-password"
            className="text-base font-medium text-foreground"
          >
            Change password
          </h2>

          <ChangePasswordForm />
        </section>
      </div>
    </div>
  );
}
