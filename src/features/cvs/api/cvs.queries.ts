import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import type { VariablesOf } from "@graphql-typed-document-node/core";

import {
  getCurrentUser,
  getGraphQLErrorCode,
  type GraphQLRequestOptions,
  protectedRequest,
} from "@/shared/api";
import { graphql } from "@/shared/api/graphql/generated/gql";

import { canAccessCv } from "../model/cv-permissions";
import { CV_FALLBACK_ROLES } from "../model/cv-project-roles";

const OPTIONS_LIMIT = 100;


export const GetCvsDocument = graphql(`
  query GetCvs($params: SearchPaginationInput) {
    cvs(params: $params) {
      items {
        id
        name
        education
        description
        user {
          id
          email
        }
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getCvs(
  params?: VariablesOf<typeof GetCvsDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetCvsDocument, { params }, options);

  return data.cvs;
}

export const GetCvsByUserIdDocument = graphql(`
  query GetCvsByUserId($userId: ID!, $params: SearchPaginationInput) {
    cvsByUserId(userId: $userId, params: $params) {
      items {
        id
        name
        education
        description
        user {
          id
          email
        }
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getCvsByUserId(
  userId: VariablesOf<typeof GetCvsByUserIdDocument>["userId"],
  params?: VariablesOf<typeof GetCvsByUserIdDocument>["params"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetCvsByUserIdDocument,
    { userId, params },
    options,
  );

  return data.cvsByUserId;
}


export const GetCvDocument = graphql(`
  query GetCv($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      created_at
      name
      education
      description
      user {
        id
        email
        position {
          id
          name
        }
        profile {
          first_name
          last_name
          full_name
          skills {
            name
            categoryId
            mastery
          }
          languages {
            name
            proficiency
          }
        }
      }
      skills {
        name
        categoryId
        mastery
      }
      languages {
        name
        proficiency
      }
      projects {
        id
        name
        internal_name
        description
        domain
        start_date
        end_date
        environment
        roles
        responsibilities
        project {
          id
        }
      }
    }
  }
`);

export async function fetchCv(
  cvId: VariablesOf<typeof GetCvDocument>["cvId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(GetCvDocument, { cvId }, options);

  return data.cv;
}

export const getCv = cache((cvId: string) =>
  fetchCv(cvId).catch((error: unknown) => {
    if (getGraphQLErrorCode(error) === "cvNotFound") {
      notFound();
    }

    throw error;
  }),
);

export const getCvContext = cache(async (cvId: string) => {
  const [cv, me] = await Promise.all([getCv(cvId), getCurrentUser()]);

  if (!canAccessCv(me, cv.user?.id)) {
    notFound();
  }

  return { cv, me };
});


export const GetCvRoleOptionsDocument = graphql(`
  query GetCvRoleOptions($params: SearchPaginationInput) {
    cvs(params: $params) {
      items {
        projects {
          roles
        }
      }
    }
  }
`);

export async function getCvRoleOptions(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetCvRoleOptionsDocument,
    { params: { page: 1, limit: OPTIONS_LIMIT } },
    options,
  );

  const roles = new Set<string>();
  for (const cv of data.cvs.items) {
    for (const project of cv.projects ?? []) {
      for (const role of project.roles) {
        roles.add(role);
      }
    }
  }

  const known = new Set<string>(CV_FALLBACK_ROLES);
  const extra = [...roles]
    .filter((role) => !known.has(role))
    .sort((a, b) => a.localeCompare(b));

  return [...CV_FALLBACK_ROLES, ...extra];
}

export const GetCvProjectOptionsDocument = graphql(`
  query GetCvProjectOptions($params: SearchPaginationInput) {
    projects(params: $params) {
      items {
        id
        name
        domain
        description
        start_date
        end_date
        environment
      }
      total
      page
      limit
      total_pages
    }
  }
`);

export async function getCvProjectOptions(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetCvProjectOptionsDocument,
    { params: { page: 1, limit: OPTIONS_LIMIT } },
    options,
  );

  return data.projects.items;
}

export const GetCvProjectDocument = graphql(`
  query GetCvProject($projectId: ID!) {
    project(projectId: $projectId) {
      id
      name
      domain
      description
      start_date
      end_date
      environment
    }
  }
`);

export async function getCvProject(
  projectId: VariablesOf<typeof GetCvProjectDocument>["projectId"],
  options?: GraphQLRequestOptions,
) {
  const data = await protectedRequest(
    GetCvProjectDocument,
    { projectId },
    options,
  );

  return data.project;
}

export const GetCvSkillCategoriesDocument = graphql(`
  query GetCvSkillCategories {
    skillCategories {
      id
      name
      order
      children {
        id
        name
        order
      }
    }
  }
`);

export async function getCvSkillCategories(options?: GraphQLRequestOptions) {
  const data = await protectedRequest(
    GetCvSkillCategoriesDocument,
    undefined,
    options,
  );

  return data.skillCategories;
}
