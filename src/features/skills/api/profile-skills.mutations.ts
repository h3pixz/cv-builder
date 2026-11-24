import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const AddMySkillDocument = graphql(`
  mutation AddMySkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function addMySkill(
  skill: VariablesOf<typeof AddMySkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddMySkillDocument, { skill }, options);

  return data.addProfileSkill;
}


export const UpdateMySkillDocument = graphql(`
  mutation UpdateMySkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function updateMySkill(
  skill: VariablesOf<typeof UpdateMySkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateMySkillDocument, { skill }, options);

  return data.updateProfileSkill;
}


export const DeleteMySkillDocument = graphql(`
  mutation DeleteMySkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`);

export async function deleteMySkill(
  skill: VariablesOf<typeof DeleteMySkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteMySkillDocument, { skill }, options);

  return data.deleteProfileSkill;
}
