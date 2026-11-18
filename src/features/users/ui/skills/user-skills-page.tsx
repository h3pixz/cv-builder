import { getSession } from "@/shared/api";
import { getUserSkills } from "../../api/profile.queries";
import { masteryLevel } from "../../model/levels";
import { LevelActions } from "../level-actions";
import { Level } from "@/shared/ui/level";

export async function UserSkillsPage({ userId }: { userId: string }) {
  const session = await getSession();
  const skills = await getUserSkills(userId, {
    accessToken: session?.access_token,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h2 className="text-sm font-medium">Current skills</h2>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-4 pl-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Level
              key={skill.name}
              label={skill.name}
              level={masteryLevel(skill.mastery)}
            />
          ))}
        </ul>
      )}

      <LevelActions addLabel="Add skill" removeLabel="Remove skills" />
    </div>
  );
}
