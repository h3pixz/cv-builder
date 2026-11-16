// features/users/ui/skills/user-skills-page.tsx
import { getSession } from "@/shared/api";
import { getSkillOptions, getUserSkills } from "../../api/users.queries";
import { groupSkills, masteryLevel } from "../../model/levels";
import { LevelActions } from "../level-actions";
import { Level } from "@/shared/ui/level";

export async function UserSkillsPage({ userId }: { userId: string }) {
  const session = await getSession();
  const options = { accessToken: session?.access_token };

  const [skills, catalog] = await Promise.all([
    getUserSkills(userId, options),
    getSkillOptions({ limit: 1 }, options),
  ]);

  const groups = groupSkills(skills, catalog.skillCategories);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills yet.</p>
      )}

      {groups.map((group) => (
        <section key={group.id} className="space-y-4">
          <h2 className="text-sm font-medium">{group.name}</h2>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-4 pl-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.skills.map((skill) => (
              <Level
                key={skill.name}
                label={skill.name}
                level={masteryLevel(skill.mastery)}
              />
            ))}
          </ul>
        </section>
      ))}

      <LevelActions addLabel="Add skill" removeLabel="Remove skills" />
    </div>
  );
}
