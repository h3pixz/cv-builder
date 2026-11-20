import {
  SKILL_MASTERY_VALUES,
  SKILL_MESSAGES,
  getSkillCategories,
  getSkillOptions,
  getUserSkills,
  groupSkills,
  masteryLevel,
} from "@/features/skills";
import { getSession } from "@/shared/api";
import { getProfilePermissions } from "@/shared/helpers/profile-permissions";

import { getCurrentUser } from "../../api/profile.queries";
import { LevelManager, type LevelOption } from "../levels/level-manager";

export async function UserSkillsPage({ userId }: { userId: string }) {
  const session = await getSession();
  const accessToken = session?.access_token;

  const [skills, currentUser, categories] = await Promise.all([
    getUserSkills(userId, { accessToken }),
    getCurrentUser(),
    getSkillCategories(),
  ]);

  const { canEdit } = getProfilePermissions({
    currentUserId: currentUser.id,
    currentUserRole: currentUser.role,
    targetUserId: userId,
  });

  const options = canEdit
    ? await getSkillOptions({ accessToken })
    : [];

  const groups = groupSkills(skills, categories).map((group) => ({
    id: group.id,
    name: group.name,
    items: group.skills.map((skill) => ({
      name: skill.name,
      level: masteryLevel(skill.mastery),
      levelLabel: skill.mastery,
    })),
  }));

  return (
    <LevelManager
      userId={userId}
      heading="Current skills"
      groups={groups}
      options={options.map(
        (skill): LevelOption => ({
          value: skill.name,
          label: skill.name,
          categoryId: skill.category?.id ?? null,
        }),
      )}
      levelOptions={SKILL_MASTERY_VALUES.map((value) => ({
        value,
        label: value,
      }))}
      formMessages={{
        nameRequired: SKILL_MESSAGES.nameRequired,
        levelRequired: SKILL_MESSAGES.masteryRequired,
      }}
      canManage={canEdit}
    />
  );
}
