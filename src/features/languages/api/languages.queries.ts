import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  protectedRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type {
  GetLanguagesCatalogQuery,
  GetLanguagesCatalogQueryVariables,
} from "@/shared/api/graphql/generated/graphql";

export const OPTIONS_LIMIT = 100;


export const GetMyLanguagesDocument = graphql(`
  query GetMyLanguages {
    me {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function getMyLanguages(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetMyLanguagesDocument,
    undefined,
    options,
  );

  return data.me.languages;
}

export async function getMyLanguagesWithToken(accessToken: string) {
  const data = await gqlRequest(GetMyLanguagesDocument, undefined, {
    accessToken,
  });

  return data.me.languages;
}


export const GetUserLanguagesDocument = graphql(`
  query GetUserLanguages($userId: ID!) {
    profile(userId: $userId) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`);

export async function getUserLanguages(
  userId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetUserLanguagesDocument,
    { userId },
    options,
  );

  return data.profile.languages;
}

export async function getUserLanguagesWithToken(
  userId: string,
  accessToken: string,
) {
  const data = await gqlRequest(
    GetUserLanguagesDocument,
    { userId },
    { accessToken },
  );

  return data.profile.languages;
}


export const GetLanguagesCatalogDocument = graphql(`
  query GetLanguagesCatalog($params: SearchPaginationInput) {
    languages(params: $params) {
      items {
        id
        iso2
        name
        native_name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getLanguagesCatalog(
  params?: VariablesOf<typeof GetLanguagesCatalogDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetLanguagesCatalogDocument,
    { params },
    options,
  );

  return data.languages;
}

type FindLanguageOptions = {
  accessToken: string;
  excludeId?: string;
};

export async function findLanguageByName(
  name: string,
  { accessToken, excludeId }: FindLanguageOptions,
) {
  const data = await gqlRequest<
    GetLanguagesCatalogQuery,
    GetLanguagesCatalogQueryVariables
  >(
    GetLanguagesCatalogDocument,
    {
      params: {
        search: name.trim(),
        page: 1,
        limit: OPTIONS_LIMIT,
      },
    },
    { accessToken },
  );

  const normalized = name.trim().toLowerCase();

  return (
    data.languages.items.find(
      (language) =>
        language.name.trim().toLowerCase() === normalized &&
        language.id !== excludeId,
    ) ?? null
  );
}

export async function findLanguageByIso(
  iso2: string,
  { accessToken, excludeId }: FindLanguageOptions,
) {
  const normalized = iso2.trim().toUpperCase();
  let page = 1;

  for (;;) {
    const data = await gqlRequest<
      GetLanguagesCatalogQuery,
      GetLanguagesCatalogQueryVariables
    >(
      GetLanguagesCatalogDocument,
      { params: { page, limit: OPTIONS_LIMIT } },
      { accessToken },
    );

    const match = data.languages.items.find(
      (language) =>
        language.iso2.trim().toUpperCase() === normalized &&
        language.id !== excludeId,
    );

    if (match) return match;
    if (page >= data.languages.total_pages) return null;

    page += 1;
  }
}

export async function getLanguageOptions(options?: GraphQLRequestOptions) {
  const result = await getLanguagesCatalog(
    { page: 1, limit: OPTIONS_LIMIT },
    options,
  );

  return result.items;
}
