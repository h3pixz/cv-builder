import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/shared/api/graphql/generated/gql";
import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api/graphql/graphql";

// -----------------------------------------------------
// CV CRUD
// -----------------------------------------------------

export const CreateCvDocument = graphql(`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`);

export async function createCv(
  cv: VariablesOf<typeof CreateCvDocument>["cv"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(CreateCvDocument, { cv }, options);

  return data.createCv;
}

// -----------------------------------------------------

export const UpdateCvDocument = graphql(`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`);

export async function updateCv(
  cv: VariablesOf<typeof UpdateCvDocument>["cv"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateCvDocument, { cv }, options);

  return data.updateCv;
}

// -----------------------------------------------------

export const DeleteCvDocument = graphql(`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`);

export async function deleteCv(
  cvId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteCvDocument, { cv: { cvId } }, options);

  return data.deleteCv;
}
