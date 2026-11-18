import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import { type GraphQLRequestOptions, protectedRequest } from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

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
// SINGLE CV
// -----------------------------------------------------

export const GetCvDocument = graphql(`
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description
      user {
        id
        email
        profile {
          first_name
          last_name
          full_name
        }
      }
      skills {
        name
        categoryId
        mastery
      }
      languages {
        name
        proficiency
      }
      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
      }
    }
  }
`);

export async function getCv(
  cvId: VariablesOf<typeof GetCvDocument>["cvId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetCvDocument, { cvId }, options);

  return data.cv;
}
