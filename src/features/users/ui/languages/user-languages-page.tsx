import { getCurrentUser, getSession } from "@/shared/api";
import { proficiencyLevel, type LevelGroup } from "@/shared/helpers";

import { getLanguageOptions, getUserLanguages } from "../../api/profile.queries";
import { getProfilePermissions } from "../../model/profile-permissions";
import { LevelManager } from "../levels/level-manager";

export async function UserLanguagesPage({ userId }: { userId: string }) {
  const session = await getSession();
  const accessToken = session?.access_token;

  const [languages, currentUser] = await Promise.all([
    getUserLanguages(userId, { accessToken }),
    getCurrentUser(),
  ]);

  const { canEdit } = getProfilePermissions({
    currentUserId: currentUser.id,
    currentUserRole: currentUser.role,
    targetUserId: userId,
  });

  const options = canEdit
    ? await getLanguageOptions({ accessToken })
    : [];

  const groups: LevelGroup[] = languages.length
    ? [
        {
          id: "languages",
          name: "Current Languages",
          items: languages.map((language) => ({
            name: language.name,
            level: proficiencyLevel(language.proficiency),
            levelLabel: language.proficiency,
          })),
        },
      ]
    : [];

  return (
    <LevelManager
      kind="language"
      userId={userId}
      heading="Current Languages"
      groups={groups}
      options={options.map((language) => ({
        value: language.name,
        label: language.name,
      }))}
      canManage={canEdit}
      showGroupNames={false}
    />
  );
}
