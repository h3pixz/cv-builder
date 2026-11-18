import { getSession } from "@/shared/api";
import { getUserLanguages } from "../../api/profile.queries";
import { proficiencyLevel } from "../../model/levels";
import { LevelActions } from "../level-actions";
import { Level } from "@/shared/ui/level";

export async function UserLanguagesPage({ userId }: { userId: string }) {
  const session = await getSession();
  const languages = await getUserLanguages(userId, {
    accessToken: session?.access_token,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h2 className="text-sm font-medium">Current languages</h2>

      {languages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No languages yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-4 pl-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((language) => (
            <Level
              key={language.name}
              label={language.name}
              level={proficiencyLevel(language.proficiency)}
            />
          ))}
        </ul>
      )}

      <LevelActions addLabel="Add language" removeLabel="Remove languages" />
    </div>
  );
}
