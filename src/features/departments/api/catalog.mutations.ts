import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

// -----------------------------------------------------
// DEPARTMENT CATALOG CRUD
// -----------------------------------------------------

export const CreateDepartmentDocument = graphql(`
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`);

export async function createDepartment(
  department: VariablesOf<typeof CreateDepartmentDocument>["department"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    CreateDepartmentDocument,
    { department },
    options,
  );

  return data.createDepartment;
}

// -----------------------------------------------------

export const UpdateDepartmentDocument = graphql(`
  mutation UpdateDepartment($department: UpdateDepartmentInput!) {
    updateDepartment(department: $department) {
      id
      created_at
      name
    }
  }
`);

export async function updateDepartment(
  department: VariablesOf<typeof UpdateDepartmentDocument>["department"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    UpdateDepartmentDocument,
    { department },
    options,
  );

  return data.updateDepartment;
}

// -----------------------------------------------------

export const DeleteDepartmentDocument = graphql(`
  mutation DeleteDepartment($department: DeleteDepartmentInput!) {
    deleteDepartment(department: $department) {
      affected
    }
  }
`);

export async function deleteDepartment(
  departmentId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteDepartmentDocument,
    { department: { departmentId } },
    options,
  );

  return data.deleteDepartment;
}
