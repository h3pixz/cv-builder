import { Suspense } from "react";

import { getCvContext, getCvSkillCategories } from "../api/cvs.queries";
import { buildCvPreview } from "../model/cv-preview";
import { CvPreviewSkeleton } from "./cv-preview-skeleton";
import { CvPreviewView } from "./cv-preview-view";

async function CvPreview({ cvId }: { cvId: string }) {
  const [{ cv }, categories] = await Promise.all([
    getCvContext(cvId),
    getCvSkillCategories(),
  ]);

  return (
    <CvPreviewView cvId={cv.id} preview={buildCvPreview(cv, categories)} />
  );
}

export function CvPreviewPage({ cvId }: { cvId: string }) {
  return (
    <Suspense fallback={<CvPreviewSkeleton />}>
      <CvPreview cvId={cvId} />
    </Suspense>
  );
}
