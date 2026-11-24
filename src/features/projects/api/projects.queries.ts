import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  protectedRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";


export const GetProjectsDocument = graphql(`
  query GetProjects($params: SearchPaginationInput) {
    projects(params: $params) {
      items {
        id
        created_at
        name
        internal_name
        domain
        start_date
        end_date
        description
        environment
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getProjectsCatalog(
  params?: VariablesOf<typeof GetProjectsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetProjectsDocument, { params }, options);

  return data.projects;
}
