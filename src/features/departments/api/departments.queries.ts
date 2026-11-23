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

// -----------------------------------------------------
// DEPARTMENTS CATALOG
// -----------------------------------------------------

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
  /** Skip this id when checking for a duplicate (edit mode). */
  excludeId?: string;
};

/**
 * Looks for an exact, case-insensitive name match in the catalog. The backend
 * search is used to narrow the list down to the relevant names.
 */
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

// -----------------------------------------------------
// USAGE CHECK
// -----------------------------------------------------

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

/**
 * A department referenced by an employee cannot be deleted. The backend has no
 * filter by department, so the users pages are walked until a match is found.
 */
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
