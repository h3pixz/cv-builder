import { describe, expect, it } from "vitest";

import { getProfilePermissions } from "./profile-permissions";

describe("getProfilePermissions", () => {
  it("lets an employee edit and upload only their own profile", () => {
    expect(
      getProfilePermissions({
        currentUserId: "user-1",
        currentUserRole: "Employee",
        targetUserId: "user-1",
      }),
    ).toEqual({
      canEdit: true,
      canUploadAvatar: true,
      canVerifyEmail: true,
    });
  });

  it("makes another user's profile read-only for an employee", () => {
    expect(
      getProfilePermissions({
        currentUserId: "user-1",
        currentUserRole: "Employee",
        targetUserId: "user-2",
      }),
    ).toEqual({
      canEdit: false,
      canUploadAvatar: false,
      canVerifyEmail: false,
    });
  });

  it("lets an admin edit and upload any profile", () => {
    expect(
      getProfilePermissions({
        currentUserId: "admin-1",
        currentUserRole: "Admin",
        targetUserId: "user-2",
      }),
    ).toEqual({
      canEdit: true,
      canUploadAvatar: true,
      canVerifyEmail: false,
    });
  });

  it("allows an admin to verify their own email", () => {
    expect(
      getProfilePermissions({
        currentUserId: "admin-1",
        currentUserRole: "Admin",
        targetUserId: "admin-1",
      }).canVerifyEmail,
    ).toBe(true);
  });

  it("denies everything without a current user", () => {
    expect(
      getProfilePermissions({ targetUserId: "user-1" }),
    ).toEqual({
      canEdit: false,
      canUploadAvatar: false,
      canVerifyEmail: false,
    });
  });
});
