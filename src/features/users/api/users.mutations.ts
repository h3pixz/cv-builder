import "server-only";

import { gqlRequest, type GraphQLRequestOptions } from "@/shared/api/graphql/graphql";
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
