import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const CreateSkillDocument = graphql(`
  mutation CreateSkill($skill: CreateSkillInput!) {
    createSkill(skill: $skill) {
      id
      name
      category {
        id
        name
      }
    }
  }
`);

export async function createSkill(
  skill: VariablesOf<typeof CreateSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(CreateSkillDocument, { skill }, options);

  return data.createSkill;
}


export const UpdateSkillDocument = graphql(`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      name
      category {
        id
        name
      }
    }
  }
`);

export async function updateSkill(
  skill: VariablesOf<typeof UpdateSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateSkillDocument, { skill }, options);

  return data.updateSkill;
}


export const DeleteSkillDocument = graphql(`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
    }
  }
`);

export async function deleteSkill(
  skillId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteSkillDocument,
    { skill: { skillId } },
    options,
  );

  return data.deleteSkill;
}
