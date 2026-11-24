import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  protectedRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type {
  GetPositionsQuery,
  GetPositionsQueryVariables,
  GetPositionUsageQuery,
  GetPositionUsageQueryVariables,
} from "@/shared/api/graphql/generated/graphql";

export const OPTIONS_LIMIT = 100;


export const GetPositionsDocument = graphql(`
  query GetPositions($params: SearchPaginationInput) {
    positions(params: $params) {
      items {
        id
        created_at
        name
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getPositionsCatalog(
  params?: VariablesOf<typeof GetPositionsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetPositionsDocument,
    { params },
    options,
  );

  return data.positions;
}

type FindPositionOptions = {
  accessToken: string;
  excludeId?: string;
};

export async function findPositionByName(
  name: string,
  { accessToken, excludeId }: FindPositionOptions,
) {
  const data = await gqlRequest<
    GetPositionsQuery,
    GetPositionsQueryVariables
  >(
    GetPositionsDocument,
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
    data.positions.items.find(
      (position) =>
        position.name.trim().toLowerCase() === normalized &&
        position.id !== excludeId,
    ) ?? null
  );
}


export const GetPositionUsageDocument = graphql(`
  query GetPositionUsage($params: SearchPaginationInput) {
    users(params: $params) {
      items {
        id
        position {
          id
        }
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function isPositionInUse(
  positionId: string,
  { accessToken }: { accessToken: string },
) {
  let page = 1;

  for (;;) {
    const data = await gqlRequest<
      GetPositionUsageQuery,
      GetPositionUsageQueryVariables
    >(
      GetPositionUsageDocument,
      { params: { page, limit: OPTIONS_LIMIT } },
      { accessToken },
    );

    const isUsed = data.users.items.some(
      (user) => user.position?.id === positionId,
    );

    if (isUsed) return true;
    if (page >= data.users.total_pages) return false;

    page += 1;
  }
}
