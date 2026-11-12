/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n": typeof types.DeleteUserDocument,
    "\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n": typeof types.UpdateUserProfileDocument,
    "\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n": typeof types.UploadUserAvatarDocument,
    "\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n": typeof types.DeleteUserAvatarDocument,
    "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n": typeof types.ChangeUserPasswordDocument,
    "\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.AddUserSkillDocument,
    "\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.UpdateUserSkillDocument,
    "\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.DeleteUserSkillDocument,
    "\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.AddUserLanguageDocument,
    "\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.UpdateUserLanguageDocument,
    "\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.DeleteUserLanguageDocument,
    "\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.GetCurrentProfileDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.GetUserSkillsDocument,
    "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.GetUserLanguagesDocument,
    "\n  query GetUserCvs($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        created_at\n        name\n        education\n        description\n        skills {\n          name\n          categoryId\n          mastery\n        }\n        languages {\n          name\n          proficiency\n        }\n        projects {\n          id\n          name\n          internal_name\n          domain\n          start_date\n          end_date\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetUserCvsDocument,
    "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skillCategories {\n      id\n      name\n      order\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n        order\n      }\n    }\n\n    skills(params: $params) {\n      items {\n        id\n        name\n        category_name\n        category_parent_name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetSkillOptionsDocument,
    "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        iso2\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetLanguageOptionsDocument,
    "\n  query GetDepartmentOptions($params: SearchPaginationInput) {\n    departments(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetDepartmentOptionsDocument,
    "\n  query GetPositionOptions($params: SearchPaginationInput) {\n    positions(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetPositionOptionsDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.UpdateTokenDocument,
};
const documents: Documents = {
    "\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n": types.DeleteUserDocument,
    "\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n": types.UpdateUserProfileDocument,
    "\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n": types.UploadUserAvatarDocument,
    "\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n": types.DeleteUserAvatarDocument,
    "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n": types.ChangeUserPasswordDocument,
    "\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.AddUserSkillDocument,
    "\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.UpdateUserSkillDocument,
    "\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.DeleteUserSkillDocument,
    "\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.AddUserLanguageDocument,
    "\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.UpdateUserLanguageDocument,
    "\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.DeleteUserLanguageDocument,
    "\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.GetCurrentProfileDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.GetUserSkillsDocument,
    "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.GetUserLanguagesDocument,
    "\n  query GetUserCvs($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        created_at\n        name\n        education\n        description\n        skills {\n          name\n          categoryId\n          mastery\n        }\n        languages {\n          name\n          proficiency\n        }\n        projects {\n          id\n          name\n          internal_name\n          domain\n          start_date\n          end_date\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetUserCvsDocument,
    "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skillCategories {\n      id\n      name\n      order\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n        order\n      }\n    }\n\n    skills(params: $params) {\n      items {\n        id\n        name\n        category_name\n        category_parent_name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetSkillOptionsDocument,
    "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        iso2\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetLanguageOptionsDocument,
    "\n  query GetDepartmentOptions($params: SearchPaginationInput) {\n    departments(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetDepartmentOptionsDocument,
    "\n  query GetPositionOptions($params: SearchPaginationInput) {\n    positions(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetPositionOptionsDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": types.UpdateTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n"): (typeof documents)["\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n"): (typeof documents)["\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserCvs($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        created_at\n        name\n        education\n        description\n        skills {\n          name\n          categoryId\n          mastery\n        }\n        languages {\n          name\n          proficiency\n        }\n        projects {\n          id\n          name\n          internal_name\n          domain\n          start_date\n          end_date\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetUserCvs($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        created_at\n        name\n        education\n        description\n        skills {\n          name\n          categoryId\n          mastery\n        }\n        languages {\n          name\n          proficiency\n        }\n        projects {\n          id\n          name\n          internal_name\n          domain\n          start_date\n          end_date\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skillCategories {\n      id\n      name\n      order\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n        order\n      }\n    }\n\n    skills(params: $params) {\n      items {\n        id\n        name\n        category_name\n        category_parent_name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skillCategories {\n      id\n      name\n      order\n      parent {\n        id\n        name\n      }\n      children {\n        id\n        name\n        order\n      }\n    }\n\n    skills(params: $params) {\n      items {\n        id\n        name\n        category_name\n        category_parent_name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        iso2\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        iso2\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDepartmentOptions($params: SearchPaginationInput) {\n    departments(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetDepartmentOptions($params: SearchPaginationInput) {\n    departments(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPositionOptions($params: SearchPaginationInput) {\n    positions(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetPositionOptions($params: SearchPaginationInput) {\n    positions(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;