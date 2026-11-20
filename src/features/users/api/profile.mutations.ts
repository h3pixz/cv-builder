import "server-only";

import { gqlRequest, type GraphQLRequestOptions } from "@/shared/api/graphql/graphql";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type { VariablesOf } from "@graphql-typed-document-node/core";

// -----------------------------------------------------
// PROFILE
// -----------------------------------------------------

export const UpdateUserProfileDocument = graphql(`
  mutation UpdateUserProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
      full_name
      avatar
      email
      is_verified
      role
    }
  }
`);

export async function updateUserProfile(
  profile: VariablesOf<typeof UpdateUserProfileDocument>["profile"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdateUserProfileDocument,
    { profile },
    options,
  );

  return data.updateProfile;
}

// -----------------------------------------------------
// AVATAR
// -----------------------------------------------------

export const UploadUserAvatarDocument = graphql(`
  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`);

export async function uploadUserAvatar(
  avatar: VariablesOf<typeof UploadUserAvatarDocument>["avatar"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UploadUserAvatarDocument, { avatar }, options);

  return data.uploadAvatar;
}

// -----------------------------------------------------

export const DeleteUserAvatarDocument = graphql(`
  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {
    deleteAvatar(avatar: $avatar)
  }
`);

export async function deleteUserAvatar(
  avatar: VariablesOf<typeof DeleteUserAvatarDocument>["avatar"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteUserAvatarDocument, { avatar }, options);

  return data.deleteAvatar;
}

// -----------------------------------------------------
// EMAIL VERIFICATION
// -----------------------------------------------------

export const SendVerificationDocument = graphql(`
  mutation SendVerification($email: String!) {
    sendVerification(email: $email)
  }
`);

export async function sendVerificationEmail(
  email: string,
  options?: GraphQLRequestOptions,
) {
  return gqlRequest(SendVerificationDocument, { email }, options);
}
