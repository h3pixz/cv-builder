"use server";

import {
  forbiddenFailure,
  getCurrentUser,
  gqlRequest,
  runAuthed,
  type ActionFailure,
} from "@/shared/api";

import { canAccessCv } from "../model/cv-permissions";
import {
  buildCvPreview,
  buildCvPreviewHtml,
  isPreviewAvailable,
  toPdfFileName,
} from "../model/cv-preview";
import { exportCvPdf } from "./cvs.mutations";
import {
  GetCvDocument,
  GetCvSkillCategoriesDocument,
} from "./cvs.queries";

const PDF_MARGIN = {
  top: "12mm",
  bottom: "12mm",
  left: "12mm",
  right: "12mm",
};

export type CvPdfExportResult =
  | { success: true; fileName: string; base64: string }
  | ActionFailure;

export async function exportCvPdfAction(
  cvId: string,
): Promise<CvPdfExportResult> {
  const me = await getCurrentUser();
  const fetched = await runAuthed(async (accessToken) => {
    const [cvData, categoriesData] = await Promise.all([
      gqlRequest(GetCvDocument, { cvId }, { accessToken }),
      gqlRequest(GetCvSkillCategoriesDocument, undefined, { accessToken }),
    ]);

    return {
      cv: cvData.cv,
      categories: categoriesData.skillCategories,
    };
  });

  if (!fetched.success) {
    return fetched;
  }

  const { cv, categories } = fetched.data;

  if (!canAccessCv(me, cv.user?.id)) {
    return forbiddenFailure();
  }

  const preview = buildCvPreview(cv, categories);

  if (!isPreviewAvailable(preview)) {
    return {
      success: false,
      error: "CV preview is not available",
      code: null,
    };
  }

  const exported = await runAuthed((accessToken) =>
    exportCvPdf(
      { html: buildCvPreviewHtml(preview), margin: PDF_MARGIN },
      { accessToken },
    ),
  );

  if (!exported.success) {
    return exported;
  }

  return {
    success: true,
    fileName: toPdfFileName(preview.name),
    base64: exported.data,
  };
}
