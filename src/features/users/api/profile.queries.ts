import "server-only";

import { cache } from "react";
import type { VariablesOf } from "@graphql-typed-document-node/core";

import { type GraphQLRequestOptions, protectedRequest } from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

// -----------------------------------------------------
// CURRENT USER PROFILE
// -----------------------------------------------------

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
// CURRENT USER ROLE
// -----------------------------------------------------

export const GetCurrentUserRoleDocument = graphql(`
  query GetCurrentUserRole {
    me {
      id
      role
    }
  }
`);

export const getCurrentUserRole = cache(async () => {
  const data = await protectedRequest(GetCurrentUserRoleDocument);

  return data.me.role;
});

// -----------------------------------------------------
// USER SKILLS
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
// SKILLS AND LANGUAGES REFERENCE DATA
// -----------------------------------------------------

const OPTIONS_LIMIT = 100;

export const GetSkillOptionsDocument = graphql(`
  query GetSkillOptions($params: SearchPaginationInput) {
    skills(params: $params) {
      items {
        id
        name
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

export async function getSkillOptions(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetSkillOptionsDocument,
    { params: { page: 1, limit: OPTIONS_LIMIT } },
    options,
  );

  return data.skills.items;
}

export const GetSkillCategoriesDocument = graphql(`
  query GetSkillCategories {
    skillCategories {
      id
      name
      order
      children {
        id
        name
        order
      }
    }
  }
`);

export async function getSkillCategories(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetSkillCategoriesDocument,
    undefined,
    options,
  );

  return data.skillCategories;
}

export const GetLanguageOptionsDocument = graphql(`
  query GetLanguageOptions($params: SearchPaginationInput) {
    languages(params: $params) {
      items {
        id
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

export async function getLanguageOptions(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetLanguageOptionsDocument,
    { params: { page: 1, limit: OPTIONS_LIMIT } },
    options,
  );

  return data.languages.items;
}

// -----------------------------------------------------
// USER LANGUAGES
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
