import { Suspense } from "react";

import {
  getCvContext,
  getCvProjectOptions,
  getCvRoleOptions,
} from "../api/cvs.queries";
import {
  toCvProjectOption,
  toCvProjectRecord,
} from "../model/cv-project-record";
import { CvProjectsManager } from "./cv-projects-manager";
import { CvProjectsSkeleton } from "./cv-projects-skeleton";

async function CvProjects({ cvId }: { cvId: string }) {
  const [{ cv }, catalog, roles] = await Promise.all([
    getCvContext(cvId),
    getCvProjectOptions(),
    getCvRoleOptions(),
  ]);

  return (
    <CvProjectsManager
      cvId={cv.id}
      projects={(cv.projects ?? []).map(toCvProjectRecord)}
      catalog={catalog.map(toCvProjectOption)}
      roles={roles}
    />
  );
}

export function CvProjectsPage({ cvId }: { cvId: string }) {
  return (
    <Suspense fallback={<CvProjectsSkeleton />}>
      <CvProjects cvId={cvId} />
    </Suspense>
  );
}
