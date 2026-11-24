import "server-only";

import { cache } from "react";
import type { VariablesOf } from "@graphql-typed-document-node/core";

import { type GraphQLRequestOptions, protectedRequest } from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


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


const OPTIONS_LIMIT = 100;

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

export const getDepartmentOptions = cache(async () => {
  const data = await protectedRequest(GetDepartmentOptionsDocument, {
    params: { page: 1, limit: OPTIONS_LIMIT },
  });

  return data.departments.items;
});

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

export const getPositionOptions = cache(async () => {
  const data = await protectedRequest(GetPositionOptionsDocument, {
    params: { page: 1, limit: OPTIONS_LIMIT },
  });

  return data.positions.items;
});
