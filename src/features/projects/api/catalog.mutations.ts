import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import { gqlRequest, type GraphQLRequestOptions } from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

// -----------------------------------------------------
// PROJECT CATALOG CRUD
// -----------------------------------------------------

export const CreateProjectDocument = graphql(`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      id
      created_at
      name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`);

export async function createProject(
  project: VariablesOf<typeof CreateProjectDocument>["project"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(CreateProjectDocument, { project }, options);

  return data.createProject;
}

// -----------------------------------------------------

export const UpdateProjectDocument = graphql(`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      id
      created_at
      name
      domain
      start_date
      end_date
      description
      environment
    }
  }
`);

export async function updateProject(
  project: VariablesOf<typeof UpdateProjectDocument>["project"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateProjectDocument, { project }, options);

  return data.updateProject;
}

// -----------------------------------------------------

export const DeleteProjectDocument = graphql(`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`);

export async function deleteProject(
  projectId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteProjectDocument,
    { project: { projectId } },
    options,
  );

  return data.deleteProject;
}
