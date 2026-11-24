import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  protectedRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";
import type {
  GetDepartmentsQuery,
  GetDepartmentsQueryVariables,
  GetDepartmentUsageQuery,
  GetDepartmentUsageQueryVariables,
} from "@/shared/api/graphql/generated/graphql";

export const OPTIONS_LIMIT = 100;


export const GetDepartmentsDocument = graphql(`
  query GetDepartments($params: SearchPaginationInput) {
    departments(params: $params) {
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

export async function getDepartmentsCatalog(
  params?: VariablesOf<typeof GetDepartmentsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetDepartmentsDocument,
    { params },
    options,
  );

  return data.departments;
}

type FindDepartmentOptions = {
  accessToken: string;
  excludeId?: string;
};

export async function findDepartmentByName(
  name: string,
  { accessToken, excludeId }: FindDepartmentOptions,
) {
  const data = await gqlRequest<
    GetDepartmentsQuery,
    GetDepartmentsQueryVariables
  >(
    GetDepartmentsDocument,
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
    data.departments.items.find(
      (department) =>
        department.name.trim().toLowerCase() === normalized &&
        department.id !== excludeId,
    ) ?? null
  );
}


export const GetDepartmentUsageDocument = graphql(`
  query GetDepartmentUsage($params: SearchPaginationInput) {
    users(params: $params) {
      items {
        id
        department {
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

export async function isDepartmentInUse(
  departmentId: string,
  { accessToken }: { accessToken: string },
) {
  let page = 1;

  for (;;) {
    const data = await gqlRequest<
      GetDepartmentUsageQuery,
      GetDepartmentUsageQueryVariables
    >(
      GetDepartmentUsageDocument,
      { params: { page, limit: OPTIONS_LIMIT } },
      { accessToken },
    );

    const isUsed = data.users.items.some(
      (user) => user.department?.id === departmentId,
    );

    if (isUsed) return true;
    if (page >= data.users.total_pages) return false;

    page += 1;
  }
}
