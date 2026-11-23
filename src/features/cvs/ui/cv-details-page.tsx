import { Suspense } from "react";

import { getCvContext } from "../api/cvs.queries";
import type { CvValues } from "../model/cv-schema";
import { CvDetailsForm } from "./cv-details-form";
import { CvDetailsSkeleton } from "./cv-details-skeleton";

async function CvDetails({ cvId }: { cvId: string }) {
  const { cv } = await getCvContext(cvId);

  const values: CvValues = {
    name: cv.name,
    education: cv.education ?? "",
    description: cv.description,
  };

  return (
    <CvDetailsForm
      cvId={cv.id}
      ownerUserId={cv.user?.id ?? null}
      values={values}
    />
  );
}

export function CvDetailsPage({ cvId }: { cvId: string }) {
  return (
    <Suspense fallback={<CvDetailsSkeleton />}>
      <CvDetails cvId={cvId} />
    </Suspense>
  );
}
