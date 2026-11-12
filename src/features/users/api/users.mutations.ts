import "server-only";

import { gqlRequest, type GraphQLRequestOptions } from "@/shared/api/graphql";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type { VariablesOf } from "@graphql-typed-document-node/core";

// -----------------------------------------------------
// USER CRUD
// -----------------------------------------------------

export const CreateUserDocument = graphql(`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      created_at
      email
      is_verified
      role
      profile {
        id
        first_name
        last_name
        full_name
        avatar
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`);

export async function createUser(
  user: VariablesOf<typeof CreateUserDocument>["user"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(CreateUserDocument, { user }, options);

  return data.createUser;
}

// -----------------------------------------------------

export const UpdateUserDocument = graphql(`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      created_at
      email
      is_verified
      role
      profile {
        id
        first_name
        last_name
        full_name
        avatar
      }
      department {
        id
        name
      }
      position {
        id
        name
      }
    }
  }
`);

export async function updateUser(
  user: VariablesOf<typeof UpdateUserDocument>["user"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateUserDocument, { user }, options);

  return data.updateUser;
}

// -----------------------------------------------------

export const DeleteUserDocument = graphql(`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      affected
    }
  }
`);

export async function deleteUser(
  userId: VariablesOf<typeof DeleteUserDocument>["userId"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteUserDocument, { userId }, options);

  return data.deleteUser;
}

// -----------------------------------------------------
// USER PROFILE
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
// PASSWORD
// -----------------------------------------------------

export const ChangeUserPasswordDocument = graphql(`
  mutation ChangeUserPassword($args: ChangePasswordInput!) {
    changePassword(args: $args) {
      id
      email
      is_verified
      role
    }
  }
`);

export async function changeUserPassword(
  args: VariablesOf<typeof ChangeUserPasswordDocument>["args"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(ChangeUserPasswordDocument, { args }, options);

  return data.changePassword;
}

// -----------------------------------------------------
// USER PROFILE SKILLS
// -----------------------------------------------------

export const AddUserSkillDocument = graphql(`
  mutation AddUserSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function addUserSkill(
  skill: VariablesOf<typeof AddUserSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddUserSkillDocument, { skill }, options);

  return data.addProfileSkill;
}

// -----------------------------------------------------

export const UpdateUserSkillDocument = graphql(`
  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function updateUserSkill(
  skill: VariablesOf<typeof UpdateUserSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateUserSkillDocument, { skill }, options);

  return data.updateProfileSkill;
}

// -----------------------------------------------------

export const DeleteUserSkillDocument = graphql(`
  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function deleteUserSkill(
  skill: VariablesOf<typeof DeleteUserSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteUserSkillDocument, { skill }, options);

  return data.deleteProfileSkill;
}

// -----------------------------------------------------
// USER PROFILE LANGUAGES
// -----------------------------------------------------

export const AddUserLanguageDocument = graphql(`
  mutation AddUserLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function addUserLanguage(
  language: VariablesOf<typeof AddUserLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddUserLanguageDocument, { language }, options);

  return data.addProfileLanguage;
}

// -----------------------------------------------------

export const UpdateUserLanguageDocument = graphql(`
  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function updateUserLanguage(
  language: VariablesOf<typeof UpdateUserLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdateUserLanguageDocument,
    { language },
    options,
  );

  return data.updateProfileLanguage;
}

// -----------------------------------------------------

export const DeleteUserLanguageDocument = graphql(`
  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function deleteUserLanguage(
  language: VariablesOf<typeof DeleteUserLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteUserLanguageDocument,
    { language },
    options,
  );

  return data.deleteProfileLanguage;
}
