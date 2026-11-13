// profile/user-profile-page.tsx (server)
import { notFound } from "next/navigation";

import { getUser } from "../../api/users.queries";
// import { AvatarUpload } from "./avatar-upload";
// import { UserProfileForm } from "./user-profile-form";

export async function UserProfilePage({ userId }: { userId: string }) {
  const user = await getUser(userId);
  if (!user) notFound();

  const firstName = user.profile.first_name ?? "";
  const lastName = user.profile.last_name ?? "";
  const fullName = `${firstName} ${lastName}`.trim() || user.email;

  // formatted on the server, so no hydration mismatch from timezones
  const memberSince = new Date(user.created_at).toDateString(); // "Sun Jan 14 2024"

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      {/* <AvatarUpload
        avatarUrl={user.profile.avatar ?? undefined}
        initial={(firstName || user.email).charAt(0).toUpperCase()}
      /> */}

      <div className="space-y-1 text-center">
        <h1 className="text-base font-medium">{fullName}</h1>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <p className="text-xs">A member since {memberSince}</p>
      </div>

      {/* <UserProfileForm
        isVerified={user.is_verified}
        values={{
          firstName,
          lastName,
          department: user.department?.name ?? "",
          position: user.position?.name ?? "",
        }}
      /> */}
    </div>
  );
}
