import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const AddMyLanguageDocument = graphql(`
  mutation AddMyLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function addMyLanguage(
  language: VariablesOf<typeof AddMyLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddMyLanguageDocument, { language }, options);

  return data.addProfileLanguage;
}


export const UpdateMyLanguageDocument = graphql(`
  mutation UpdateMyLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function updateMyLanguage(
  language: VariablesOf<typeof UpdateMyLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdateMyLanguageDocument,
    { language },
    options,
  );

  return data.updateProfileLanguage;
}


export const DeleteMyLanguageDocument = graphql(`
  mutation DeleteMyLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function deleteMyLanguage(
  language: VariablesOf<typeof DeleteMyLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteMyLanguageDocument,
    { language },
    options,
  );

  return data.deleteProfileLanguage;
}
