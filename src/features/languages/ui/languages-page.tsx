import { getCurrentUser } from "../api/current-user";
import { getLanguageOptions, getMyLanguages } from "../api/languages.queries";
import { proficiencyLevel } from "../model/language-levels";
import { LanguagesManager } from "./languages-manager";

export async function LanguagesPage() {
  const me = await getCurrentUser();

  if (!me.id) {
    return null;
  }

  const [languages, catalog] = await Promise.all([
    getMyLanguages(),
    getLanguageOptions(),
  ]);

  return (
    <LanguagesManager
      userId={me.id}
      items={languages.map((language) => ({
        name: language.name,
        level: proficiencyLevel(language.proficiency),
        levelLabel: language.proficiency,
      }))}
      options={catalog.map((language) => ({
        value: language.name,
        label: language.name,
      }))}
    />
  );
}
