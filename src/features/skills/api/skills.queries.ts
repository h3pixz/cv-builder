import "server-only";

import { cache } from "react";
import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  protectedRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type {
  GetSkillsCatalogQuery,
  GetSkillsCatalogQueryVariables,
} from "@/shared/api/graphql/generated/graphql";

// -----------------------------------------------------
// MY SKILLS
// -----------------------------------------------------

export const GetMySkillsDocument = graphql(`
  query GetMySkills {
    me {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function getMySkills(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetMySkillsDocument,
    undefined,
    options,
  );

  return data.me.skills;
}

/** Server Actions have to pass the access token explicitly. */
export async function getMySkillsWithToken(accessToken: string) {
  const data = await gqlRequest(GetMySkillsDocument, undefined, {
    accessToken,
  });

  return data.me.skills;
}

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
// SKILLS CATALOG
// -----------------------------------------------------

export const GetSkillsCatalogDocument = graphql(`
  query GetSkillsCatalog($params: SearchPaginationInput) {
    skills(params: $params) {
      items {
        id
        name
        category {
          id
          name
          parent {
            id
            name
          }
        }
        category_name
        category_parent_name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getSkillsCatalog(
  params?: VariablesOf<typeof GetSkillsCatalogDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetSkillsCatalogDocument,
    { params },
    options,
  );

  return data.skills;
}

type FindSkillOptions = {
  accessToken: string;
  /** Skip this id when checking for a duplicate (edit mode). */
  excludeId?: string;
};

/**
 * Looks for an exact, case-insensitive name match in the catalog. The backend
 * search is used to narrow the list down to the relevant names.
 */
export async function findSkillByName(
  name: string,
  { accessToken, excludeId }: FindSkillOptions,
) {
  const data = await gqlRequest<
    GetSkillsCatalogQuery,
    GetSkillsCatalogQueryVariables
  >(
    GetSkillsCatalogDocument,
    {
      params: {
        search: name.trim(),
        page: 1,
        limit: OPTIONS_LIMIT,
      },
    },
    { accessToken },
  );

  const normalized = name.trim().toLowerCase();

  return (
    data.skills.items.find(
      (skill) =>
        skill.name.trim().toLowerCase() === normalized && skill.id !== excludeId,
    ) ?? null
  );
}

// -----------------------------------------------------
// SKILL CATEGORIES
// -----------------------------------------------------

export const OPTIONS_LIMIT = 100;

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

export const getSkillCategories = cache(async () => {
  const data = await protectedRequest(GetSkillCategoriesDocument, undefined);

  return data.skillCategories;
});

/** All catalog skills offered by the "Add skill" dialog. */
export async function getSkillOptions(options?: GraphQLRequestOptions) {
  const result = await getSkillsCatalog(
    { page: 1, limit: OPTIONS_LIMIT },
    options,
  );

  return result.items;
}
