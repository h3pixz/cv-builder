import { getSession } from "@/shared/api";

import {
  getCurrentUser,
  getSkillCategories,
  getSkillOptions,
  getUserSkills,
} from "../../api/profile.queries";
import { groupSkills, masteryLevel } from "../../model/levels";
import { getProfilePermissions } from "../../model/profile-permissions";
import { LevelManager, type LevelOption } from "../levels/level-manager";

export async function UserSkillsPage({ userId }: { userId: string }) {
  const session = await getSession();
  const accessToken = session?.access_token;

  const [skills, currentUser, categories] = await Promise.all([
    getUserSkills(userId, { accessToken }),
    getCurrentUser(),
    getSkillCategories({ accessToken }),
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
      kind="skill"
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
      canManage={canEdit}
    />
  );
}
