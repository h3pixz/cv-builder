import { getSession } from "@/shared/api";
import { getProfilePermissions } from "@/shared/helpers/profile-permissions";

import { getCurrentUser } from "../api/current-user";
import {
  getLanguageOptions,
  getUserLanguages,
} from "../api/languages.queries";
import { proficiencyLevel } from "../model/language-levels";
import { LanguagesManager } from "./languages-manager";

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

  return (
    <LanguagesManager
      userId={userId}
      canManage={canEdit}
      heading="Current Languages"
      headingAs="h2"
      items={languages.map((language) => ({
        name: language.name,
        level: proficiencyLevel(language.proficiency),
        levelLabel: language.proficiency,
      }))}
      options={options.map((language) => ({
        value: language.name,
        label: language.name,
      }))}
    />
  );
}
