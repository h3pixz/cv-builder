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
    "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n        email\n        is_verified\n        role\n      }\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.SignupDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n": typeof types.VerifyMailDocument,
    "\n  mutation SendVerification($email: String!) {\n    sendVerification(email: $email)\n  }\n": typeof types.SendVerificationDocument,
    "\n  mutation CreateCv($cv: CreateCvInput!) {\n    createCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n": typeof types.CreateCvDocument,
    "\n  mutation UpdateCv($cv: UpdateCvInput!) {\n    updateCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n": typeof types.UpdateCvDocument,
    "\n  mutation DeleteCv($cv: DeleteCvInput!) {\n    deleteCv(cv: $cv) {\n      affected\n    }\n  }\n": typeof types.DeleteCvDocument,
    "\n  mutation AddCvSkill($skill: AddCvSkillInput!) {\n    addCvSkill(skill: $skill) {\n      id\n    }\n  }\n": typeof types.AddCvSkillDocument,
    "\n  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {\n    updateCvSkill(skill: $skill) {\n      id\n    }\n  }\n": typeof types.UpdateCvSkillDocument,
    "\n  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {\n    deleteCvSkill(skill: $skill) {\n      id\n    }\n  }\n": typeof types.DeleteCvSkillDocument,
    "\n  mutation AddCvProject($project: AddCvProjectInput!) {\n    addCvProject(project: $project) {\n      id\n    }\n  }\n": typeof types.AddCvProjectDocument,
    "\n  mutation UpdateCvProject($project: UpdateCvProjectInput!) {\n    updateCvProject(project: $project) {\n      id\n    }\n  }\n": typeof types.UpdateCvProjectDocument,
    "\n  mutation RemoveCvProject($project: RemoveCvProjectInput!) {\n    removeCvProject(project: $project) {\n      id\n    }\n  }\n": typeof types.RemoveCvProjectDocument,
    "\n  mutation ExportCvPdf($pdf: ExportPdfInput!) {\n    exportPdf(pdf: $pdf)\n  }\n": typeof types.ExportCvPdfDocument,
    "\n  query GetCvs($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetCvsDocument,
    "\n  query GetCvsByUserId($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetCvsByUserIdDocument,
    "\n  query GetCv($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      created_at\n      name\n      education\n      description\n      user {\n        id\n        email\n        position {\n          id\n          name\n        }\n        profile {\n          first_name\n          last_name\n          full_name\n          skills {\n            name\n            categoryId\n            mastery\n          }\n          languages {\n            name\n            proficiency\n          }\n        }\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n      projects {\n        id\n        name\n        internal_name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        roles\n        responsibilities\n        project {\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetCvDocument,
    "\n  query GetCvRoleOptions($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        projects {\n          roles\n        }\n      }\n    }\n  }\n": typeof types.GetCvRoleOptionsDocument,
    "\n  query GetCvProjectOptions($params: SearchPaginationInput) {\n    projects(params: $params) {\n      items {\n        id\n        name\n        domain\n        description\n        start_date\n        end_date\n        environment\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetCvProjectOptionsDocument,
    "\n  query GetCvProject($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      name\n      domain\n      description\n      start_date\n      end_date\n      environment\n    }\n  }\n": typeof types.GetCvProjectDocument,
    "\n  query GetCvSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n": typeof types.GetCvSkillCategoriesDocument,
    "\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n": typeof types.UpdateUserProfileDocument,
    "\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n": typeof types.UploadUserAvatarDocument,
    "\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n": typeof types.DeleteUserAvatarDocument,
    "\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.AddUserSkillDocument,
    "\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.UpdateUserSkillDocument,
    "\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.DeleteUserSkillDocument,
    "\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.AddUserLanguageDocument,
    "\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.UpdateUserLanguageDocument,
    "\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.DeleteUserLanguageDocument,
    "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.GetCurrentProfileDocument,
    "\n  query GetCurrentUserRole {\n    me {\n      id\n      role\n    }\n  }\n": typeof types.GetCurrentUserRoleDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.GetUserSkillsDocument,
    "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skills(params: $params) {\n      items {\n        id\n        name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetSkillOptionsDocument,
    "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n": typeof types.GetSkillCategoriesDocument,
    "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetLanguageOptionsDocument,
    "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": typeof types.GetUserLanguagesDocument,
    "\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n": typeof types.DeleteUserDocument,
    "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n": typeof types.ChangeUserPasswordDocument,
    "\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetDepartmentOptions($params: SearchPaginationInput) {\n    departments(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetDepartmentOptionsDocument,
    "\n  query GetPositionOptions($params: SearchPaginationInput) {\n    positions(params: $params) {\n      items {\n        id\n        name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": typeof types.GetPositionOptionsDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.UpdateTokenDocument,
};
const documents: Documents = {
    "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n        email\n        is_verified\n        role\n      }\n      access_token\n      refresh_token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n": types.SignupDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n": types.VerifyMailDocument,
    "\n  mutation SendVerification($email: String!) {\n    sendVerification(email: $email)\n  }\n": types.SendVerificationDocument,
    "\n  mutation CreateCv($cv: CreateCvInput!) {\n    createCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n": types.CreateCvDocument,
    "\n  mutation UpdateCv($cv: UpdateCvInput!) {\n    updateCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n": types.UpdateCvDocument,
    "\n  mutation DeleteCv($cv: DeleteCvInput!) {\n    deleteCv(cv: $cv) {\n      affected\n    }\n  }\n": types.DeleteCvDocument,
    "\n  mutation AddCvSkill($skill: AddCvSkillInput!) {\n    addCvSkill(skill: $skill) {\n      id\n    }\n  }\n": types.AddCvSkillDocument,
    "\n  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {\n    updateCvSkill(skill: $skill) {\n      id\n    }\n  }\n": types.UpdateCvSkillDocument,
    "\n  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {\n    deleteCvSkill(skill: $skill) {\n      id\n    }\n  }\n": types.DeleteCvSkillDocument,
    "\n  mutation AddCvProject($project: AddCvProjectInput!) {\n    addCvProject(project: $project) {\n      id\n    }\n  }\n": types.AddCvProjectDocument,
    "\n  mutation UpdateCvProject($project: UpdateCvProjectInput!) {\n    updateCvProject(project: $project) {\n      id\n    }\n  }\n": types.UpdateCvProjectDocument,
    "\n  mutation RemoveCvProject($project: RemoveCvProjectInput!) {\n    removeCvProject(project: $project) {\n      id\n    }\n  }\n": types.RemoveCvProjectDocument,
    "\n  mutation ExportCvPdf($pdf: ExportPdfInput!) {\n    exportPdf(pdf: $pdf)\n  }\n": types.ExportCvPdfDocument,
    "\n  query GetCvs($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetCvsDocument,
    "\n  query GetCvsByUserId($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetCvsByUserIdDocument,
    "\n  query GetCv($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      created_at\n      name\n      education\n      description\n      user {\n        id\n        email\n        position {\n          id\n          name\n        }\n        profile {\n          first_name\n          last_name\n          full_name\n          skills {\n            name\n            categoryId\n            mastery\n          }\n          languages {\n            name\n            proficiency\n          }\n        }\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n      projects {\n        id\n        name\n        internal_name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        roles\n        responsibilities\n        project {\n          id\n        }\n      }\n    }\n  }\n": types.GetCvDocument,
    "\n  query GetCvRoleOptions($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        projects {\n          roles\n        }\n      }\n    }\n  }\n": types.GetCvRoleOptionsDocument,
    "\n  query GetCvProjectOptions($params: SearchPaginationInput) {\n    projects(params: $params) {\n      items {\n        id\n        name\n        domain\n        description\n        start_date\n        end_date\n        environment\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetCvProjectOptionsDocument,
    "\n  query GetCvProject($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      name\n      domain\n      description\n      start_date\n      end_date\n      environment\n    }\n  }\n": types.GetCvProjectDocument,
    "\n  query GetCvSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n": types.GetCvSkillCategoriesDocument,
    "\n  mutation UpdateUserProfile($profile: UpdateProfileInput!) {\n    updateProfile(profile: $profile) {\n      id\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n    }\n  }\n": types.UpdateUserProfileDocument,
    "\n  mutation UploadUserAvatar($avatar: UploadAvatarInput!) {\n    uploadAvatar(avatar: $avatar)\n  }\n": types.UploadUserAvatarDocument,
    "\n  mutation DeleteUserAvatar($avatar: DeleteAvatarInput!) {\n    deleteAvatar(avatar: $avatar)\n  }\n": types.DeleteUserAvatarDocument,
    "\n  mutation AddUserSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.AddUserSkillDocument,
    "\n  mutation UpdateUserSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.UpdateUserSkillDocument,
    "\n  mutation DeleteUserSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.DeleteUserSkillDocument,
    "\n  mutation AddUserLanguage($language: AddProfileLanguageInput!) {\n    addProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.AddUserLanguageDocument,
    "\n  mutation UpdateUserLanguage($language: UpdateProfileLanguageInput!) {\n    updateProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.UpdateUserLanguageDocument,
    "\n  mutation DeleteUserLanguage($language: DeleteProfileLanguageInput!) {\n    deleteProfileLanguage(language: $language) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.DeleteUserLanguageDocument,
    "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.GetCurrentProfileDocument,
    "\n  query GetCurrentUserRole {\n    me {\n      id\n      role\n    }\n  }\n": types.GetCurrentUserRoleDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.GetUserSkillsDocument,
    "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skills(params: $params) {\n      items {\n        id\n        name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetSkillOptionsDocument,
    "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n": types.GetSkillCategoriesDocument,
    "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetLanguageOptionsDocument,
    "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n": types.GetUserLanguagesDocument,
    "\n  mutation CreateUser($user: CreateUserInput!) {\n    createUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($user: UpdateUserInput!) {\n    updateUser(user: $user) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        first_name\n        last_name\n        full_name\n        avatar\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation DeleteUser($userId: ID!) {\n    deleteUser(userId: $userId) {\n      affected\n    }\n  }\n": types.DeleteUserDocument,
    "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n": types.ChangeUserPasswordDocument,
    "\n  query GetUsers($params: SearchPaginationInput) {\n    users(params: $params) {\n      items {\n        id\n        created_at\n        email\n        is_verified\n        role\n        profile {\n          id\n          first_name\n          last_name\n          full_name\n          avatar\n        }\n        department {\n          id\n          name\n        }\n        position {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n": types.GetUsersDocument,
    "\n  query GetUser($userId: ID!) {\n    user(userId: $userId) {\n      id\n      created_at\n      email\n      is_verified\n      role\n      profile {\n        id\n        created_at\n        first_name\n        last_name\n        full_name\n        avatar\n        email\n      }\n      department {\n        id\n        name\n      }\n      position {\n        id\n        name\n      }\n    }\n  }\n": types.GetUserDocument,
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
export function graphql(source: "\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n        email\n        is_verified\n        role\n      }\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n        email\n        is_verified\n        role\n      }\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($auth: SignupInput!) {\n    signup(auth: $auth) {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n"): (typeof documents)["\n  mutation VerifyMail($mail: VerifyMailInput!) {\n    verifyMail(mail: $mail)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendVerification($email: String!) {\n    sendVerification(email: $email)\n  }\n"): (typeof documents)["\n  mutation SendVerification($email: String!) {\n    sendVerification(email: $email)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCv($cv: CreateCvInput!) {\n    createCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCv($cv: CreateCvInput!) {\n    createCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCv($cv: UpdateCvInput!) {\n    updateCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCv($cv: UpdateCvInput!) {\n    updateCv(cv: $cv) {\n      id\n      created_at\n      name\n      education\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCv($cv: DeleteCvInput!) {\n    deleteCv(cv: $cv) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCv($cv: DeleteCvInput!) {\n    deleteCv(cv: $cv) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddCvSkill($skill: AddCvSkillInput!) {\n    addCvSkill(skill: $skill) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation AddCvSkill($skill: AddCvSkillInput!) {\n    addCvSkill(skill: $skill) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {\n    updateCvSkill(skill: $skill) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {\n    updateCvSkill(skill: $skill) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {\n    deleteCvSkill(skill: $skill) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {\n    deleteCvSkill(skill: $skill) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddCvProject($project: AddCvProjectInput!) {\n    addCvProject(project: $project) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation AddCvProject($project: AddCvProjectInput!) {\n    addCvProject(project: $project) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCvProject($project: UpdateCvProjectInput!) {\n    updateCvProject(project: $project) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCvProject($project: UpdateCvProjectInput!) {\n    updateCvProject(project: $project) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCvProject($project: RemoveCvProjectInput!) {\n    removeCvProject(project: $project) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveCvProject($project: RemoveCvProjectInput!) {\n    removeCvProject(project: $project) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExportCvPdf($pdf: ExportPdfInput!) {\n    exportPdf(pdf: $pdf)\n  }\n"): (typeof documents)["\n  mutation ExportCvPdf($pdf: ExportPdfInput!) {\n    exportPdf(pdf: $pdf)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvs($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetCvs($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvsByUserId($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetCvsByUserId($userId: ID!, $params: SearchPaginationInput) {\n    cvsByUserId(userId: $userId, params: $params) {\n      items {\n        id\n        name\n        education\n        description\n        user {\n          id\n          email\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCv($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      created_at\n      name\n      education\n      description\n      user {\n        id\n        email\n        position {\n          id\n          name\n        }\n        profile {\n          first_name\n          last_name\n          full_name\n          skills {\n            name\n            categoryId\n            mastery\n          }\n          languages {\n            name\n            proficiency\n          }\n        }\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n      projects {\n        id\n        name\n        internal_name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        roles\n        responsibilities\n        project {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCv($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      created_at\n      name\n      education\n      description\n      user {\n        id\n        email\n        position {\n          id\n          name\n        }\n        profile {\n          first_name\n          last_name\n          full_name\n          skills {\n            name\n            categoryId\n            mastery\n          }\n          languages {\n            name\n            proficiency\n          }\n        }\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n      projects {\n        id\n        name\n        internal_name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        roles\n        responsibilities\n        project {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvRoleOptions($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        projects {\n          roles\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCvRoleOptions($params: SearchPaginationInput) {\n    cvs(params: $params) {\n      items {\n        projects {\n          roles\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvProjectOptions($params: SearchPaginationInput) {\n    projects(params: $params) {\n      items {\n        id\n        name\n        domain\n        description\n        start_date\n        end_date\n        environment\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetCvProjectOptions($params: SearchPaginationInput) {\n    projects(params: $params) {\n      items {\n        id\n        name\n        domain\n        description\n        start_date\n        end_date\n        environment\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvProject($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      name\n      domain\n      description\n      start_date\n      end_date\n      environment\n    }\n  }\n"): (typeof documents)["\n  query GetCvProject($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      name\n      domain\n      description\n      start_date\n      end_date\n      environment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCvSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCvSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentProfile {\n    me {\n      id\n      created_at\n      first_name\n      last_name\n      full_name\n      avatar\n      email\n      is_verified\n      role\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUserRole {\n    me {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUserRole {\n    me {\n      id\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserSkills($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skills(params: $params) {\n      items {\n        id\n        name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetSkillOptions($params: SearchPaginationInput) {\n    skills(params: $params) {\n      items {\n        id\n        name\n        category {\n          id\n          name\n        }\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n      children {\n        id\n        name\n        order\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"): (typeof documents)["\n  query GetLanguageOptions($params: SearchPaginationInput) {\n    languages(params: $params) {\n      items {\n        id\n        name\n        native_name\n      }\n      total\n      page\n      limit\n      total_pages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserLanguages($userId: ID!) {\n    profile(userId: $userId) {\n      id\n      languages {\n        name\n        proficiency\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeUserPassword($args: ChangePasswordInput!) {\n    changePassword(args: $args) {\n      id\n      email\n      is_verified\n      role\n    }\n  }\n"];
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