import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import { type GraphQLRequestOptions } from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

import { protectedRequest } from "@/shared/api";

export const GetUsersDocument = graphql(`
  query GetUsers($params: SearchPaginationInput) {
    users(params: $params) {
      items {
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
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getUsers(
  params?: VariablesOf<typeof GetUsersDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetUsersDocument, { params }, options);

  return data.users;
}

// -----------------------------------------------------
// SINGLE USER / PROFILE PAGE
// -----------------------------------------------------

export const GetUserDocument = graphql(`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      id
      created_at
      email
      is_verified
      role
      profile {
        id
        created_at
        first_name
        last_name
        full_name
        avatar
        email
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

export async function getUser(
  userId: VariablesOf<typeof GetUserDocument>["userId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetUserDocument, { userId }, options);

  return data.user;
}

export const GetCurrentProfileDocument = graphql(`
  query GetCurrentProfile {
    me {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
      email
      is_verified
      role
      skills {
        name
        categoryId
        mastery
      }
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function getCurrentProfile(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetCurrentProfileDocument,
    undefined,
    options,
  );

  return data.me;
}

// -----------------------------------------------------
// USER SKILLS PAGE
// -----------------------------------------------------

export const GetUserSkillsDocument = graphql(`
  query GetUserSkills($userId: ID!) {
    profile(userId: $userId) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function getUserSkills(
  userId: VariablesOf<typeof GetUserSkillsDocument>["userId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetUserSkillsDocument,
    { userId },
    options,
  );

  return data.profile.skills;
}

// -----------------------------------------------------
// USER LANGUAGES PAGE
// -----------------------------------------------------

export const GetUserLanguagesDocument = graphql(`
  query GetUserLanguages($userId: ID!) {
    profile(userId: $userId) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function getUserLanguages(
  userId: VariablesOf<typeof GetUserLanguagesDocument>["userId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetUserLanguagesDocument,
    { userId },
    options,
  );

  return data.profile.languages;
}

// -----------------------------------------------------
// USER CVS PAGE
// -----------------------------------------------------

export const GetUserCvsDocument = graphql(`
  query GetUserCvs($userId: ID!, $params: SearchPaginationInput) {
    cvsByUserId(userId: $userId, params: $params) {
      items {
        id
        created_at
        name
        education
        description
        skills {
          name
          categoryId
          mastery
        }
        languages {
          name
          proficiency
        }
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getUserCvs(
  userId: VariablesOf<typeof GetUserCvsDocument>["userId"],
  params?: VariablesOf<typeof GetUserCvsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetUserCvsDocument,
    { userId, params },
    options,
  );

  return data.cvsByUserId;
}

// -----------------------------------------------------
// SKILLS CATALOG
// Data for adding skills to a user profile
// -----------------------------------------------------

export const GetSkillOptionsDocument = graphql(`
  query GetSkillOptions($params: SearchPaginationInput) {
    skillCategories {
      id
      name
      order
      parent {
        id
        name
      }
      children {
        id
        name
        order
      }
    }

    skills(params: $params) {
      items {
        id
        name
        category_name
        category_parent_name
        category {
          id
          name
        }
      }
      total
      page
      limit
      total_pages
    }
  }
`);

// Returns the whole result: both `skillCategories` and `skills` are needed.
export async function getSkillOptions(
  params?: VariablesOf<typeof GetSkillOptionsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  return protectedRequest(GetSkillOptionsDocument, { params }, options);
}

// -----------------------------------------------------
// LANGUAGES CATALOG
// Data for adding languages to a user profile
// -----------------------------------------------------

export const GetLanguageOptionsDocument = graphql(`
  query GetLanguageOptions($params: SearchPaginationInput) {
    languages(params: $params) {
      items {
        id
        iso2
        name
        native_name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getLanguageOptions(
  params?: VariablesOf<typeof GetLanguageOptionsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetLanguageOptionsDocument,
    { params },
    options,
  );

  return data.languages;
}

// -----------------------------------------------------
// DEPARTMENT OPTIONS
// -----------------------------------------------------

export const GetDepartmentOptionsDocument = graphql(`
  query GetDepartmentOptions($params: SearchPaginationInput) {
    departments(params: $params) {
      items {
        id
        name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getDepartmentOptions(
  params?: VariablesOf<typeof GetDepartmentOptionsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetDepartmentOptionsDocument,
    { params },
    options,
  );

  return data.departments;
}

// -----------------------------------------------------
// POSITION OPTIONS
// -----------------------------------------------------

export const GetPositionOptionsDocument = graphql(`
  query GetPositionOptions($params: SearchPaginationInput) {
    positions(params: $params) {
      items {
        id
        name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getPositionOptions(
  params?: VariablesOf<typeof GetPositionOptionsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetPositionOptionsDocument,
    { params },
    options,
  );

  return data.positions;
}
