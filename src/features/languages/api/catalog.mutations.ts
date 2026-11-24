import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const CreateLanguageDocument = graphql(`
  mutation CreateLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      id
      iso2
      name
      native_name
    }
  }
`);

export async function createLanguage(
  language: VariablesOf<typeof CreateLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    CreateLanguageDocument,
    { language },
    options,
  );

  return data.createLanguage;
}


export const UpdateLanguageDocument = graphql(`
  mutation UpdateLanguage($language: UpdateLanguageInput!) {
    updateLanguage(language: $language) {
      id
      iso2
      name
      native_name
    }
  }
`);

export async function updateLanguage(
  language: VariablesOf<typeof UpdateLanguageDocument>["language"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdateLanguageDocument,
    { language },
    options,
  );

  return data.updateLanguage;
}


export const DeleteLanguageDocument = graphql(`
  mutation DeleteLanguage($language: DeleteLanguageInput!) {
    deleteLanguage(language: $language) {
      affected
    }
  }
`);

export async function deleteLanguage(
  languageId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteLanguageDocument,
    { language: { languageId } },
    options,
  );

  return data.deleteLanguage;
}
