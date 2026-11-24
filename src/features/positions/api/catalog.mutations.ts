import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const CreatePositionDocument = graphql(`
  mutation CreatePosition($position: CreatePositionInput!) {
    createPosition(position: $position) {
      id
      created_at
      name
    }
  }
`);

export async function createPosition(
  position: VariablesOf<typeof CreatePositionDocument>["position"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    CreatePositionDocument,
    { position },
    options,
  );

  return data.createPosition;
}


export const UpdatePositionDocument = graphql(`
  mutation UpdatePosition($position: UpdatePositionInput!) {
    updatePosition(position: $position) {
      id
      created_at
      name
    }
  }
`);

export async function updatePosition(
  position: VariablesOf<typeof UpdatePositionDocument>["position"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdatePositionDocument,
    { position },
    options,
  );

  return data.updatePosition;
}


export const DeletePositionDocument = graphql(`
  mutation DeletePosition($position: DeletePositionInput!) {
    deletePosition(position: $position) {
      affected
    }
  }
`);

export async function deletePosition(
  positionId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeletePositionDocument,
    { position: { positionId } },
    options,
  );

  return data.deletePosition;
}
