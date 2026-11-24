import "server-only";

import type { VariablesOf } from "@graphql-typed-document-node/core";

import { graphql } from "@/shared/api/graphql/generated/gql";
import {
  gqlRequest,
  type GraphQLRequestOptions,
} from "@/shared/api/graphql/graphql";


export const CreateCvDocument = graphql(`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`);

export async function createCv(
  cv: VariablesOf<typeof CreateCvDocument>["cv"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(CreateCvDocument, { cv }, options);

  return data.createCv;
}

export const UpdateCvDocument = graphql(`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      created_at
      name
      education
      description
    }
  }
`);

export async function updateCv(
  cv: VariablesOf<typeof UpdateCvDocument>["cv"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateCvDocument, { cv }, options);

  return data.updateCv;
}

export const DeleteCvDocument = graphql(`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`);

export async function deleteCv(
  cvId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(DeleteCvDocument, { cv: { cvId } }, options);

  return data.deleteCv;
}


export const AddCvSkillDocument = graphql(`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
    }
  }
`);

export async function addCvSkill(
  skill: VariablesOf<typeof AddCvSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddCvSkillDocument, { skill }, options);

  return data.addCvSkill;
}

export const UpdateCvSkillDocument = graphql(`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      id
    }
  }
`);

export async function updateCvSkill(
  skill: VariablesOf<typeof UpdateCvSkillDocument>["skill"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateCvSkillDocument, { skill }, options);

  return data.updateCvSkill;
}

export const DeleteCvSkillDocument = graphql(`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
    }
  }
`);

export async function deleteCvSkill(
  cvId: string,
  names: string[],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    DeleteCvSkillDocument,
    { skill: { cvId, name: names } },
    options,
  );

  return data.deleteCvSkill;
}


export const AddCvProjectDocument = graphql(`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
    }
  }
`);

export async function addCvProject(
  project: VariablesOf<typeof AddCvProjectDocument>["project"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(AddCvProjectDocument, { project }, options);

  return data.addCvProject;
}

export const UpdateCvProjectDocument = graphql(`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
    }
  }
`);

export async function updateCvProject(
  project: VariablesOf<typeof UpdateCvProjectDocument>["project"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(UpdateCvProjectDocument, { project }, options);

  return data.updateCvProject;
}

export const RemoveCvProjectDocument = graphql(`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
    }
  }
`);

export async function removeCvProject(
  cvId: string,
  projectId: string,
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(
    RemoveCvProjectDocument,
    { project: { cvId, projectId } },
    options,
  );

  return data.removeCvProject;
}


export const ExportCvPdfDocument = graphql(`
  mutation ExportCvPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf)
  }
`);

export async function exportCvPdf(
  pdf: VariablesOf<typeof ExportCvPdfDocument>["pdf"],
  options?: GraphQLRequestOptions,
) {
  const data = await gqlRequest(ExportCvPdfDocument, { pdf }, options);

  return data.exportPdf;
}
