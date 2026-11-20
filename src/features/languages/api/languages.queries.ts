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

// -----------------------------------------------------
// MY LANGUAGES
// -----------------------------------------------------

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

/** Server Actions have to pass the access token explicitly. */
export async function getMyLanguagesWithToken(accessToken: string) {
  const data = await gqlRequest(GetMyLanguagesDocument, undefined, {
    accessToken,
  });

  return data.me.languages;
}

// -----------------------------------------------------
// LANGUAGES OF A USER
// -----------------------------------------------------

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

/** Server Actions have to pass the access token explicitly. */
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

// -----------------------------------------------------
// LANGUAGES CATALOG
// -----------------------------------------------------

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
  /** Skip this id when checking for a duplicate (edit mode). */
  excludeId?: string;
};

/**
 * Looks for an exact, case-insensitive name match in the catalog. The backend
 * search is used to narrow the list down to the relevant names.
 */
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

/**
 * The backend search matches names, so the ISO check walks the catalog pages.
 * The catalog is small enough for an admin form; the loop stops at the last
 * page reported by the backend.
 */
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

/** All catalog languages offered by the "Add language" dialog. */
export async function getLanguageOptions(options?: GraphQLRequestOptions) {
  const result = await getLanguagesCatalog(
    { page: 1, limit: OPTIONS_LIMIT },
    options,
  );

  return result.items;
}
