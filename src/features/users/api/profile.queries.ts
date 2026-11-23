import "server-only";

import { cache } from "react";

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

