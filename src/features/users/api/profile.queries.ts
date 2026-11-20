import "server-only";

import { cache } from "react";
import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  getSession,
  getTokenPayload,
  type GraphQLRequestOptions,
  protectedRequest,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

import { USER_ROLES, type UserRoleValue } from "../model/user-schema";

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
// CURRENT USER
// -----------------------------------------------------

export type SessionUser = {
  id: string | null;
  email: string | null;
  role: UserRoleValue | null;
};

function toUserRole(value: string | null): UserRoleValue | null {
  return USER_ROLES.find((role) => role === value) ?? null;
}

/**
 * `me.id` is the profile id, which differs from the user id used by the
 * profile routes and backend guards. The id, email and role of the signed-in
 * user come from the access token claims.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser> => {
  const session = await getSession();

  if (!session) {
    return { id: null, email: null, role: null };
  }

  const payload = getTokenPayload(session.access_token);

  return {
    id: payload.sub,
    email: payload.email,
    role: toUserRole(payload.role),
  };
});

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
// LANGUAGES REFERENCE DATA
// -----------------------------------------------------

const OPTIONS_LIMIT = 100;

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
