import { notFound } from "next/navigation";

import { getGraphQLErrorCode } from "@/shared/api";

import { getCv } from "../../api/cvs.queries";
import { getCurrentUser } from "../../api/profile.queries";
import { canManageCvs } from "../../model/cv-permissions";
import { CvDetails } from "./cv-details";

export async function UserCvDetailsPage({
  userId,
  cvId,
}: {
  userId: string;
  cvId: string;
}) {
  const me = await getCurrentUser();

  if (!canManageCvs(me.role)) {
    notFound();
  }

  const cv = await getCv(cvId).catch((error: unknown) => {
    if (getGraphQLErrorCode(error) === "cvNotFound") {
      notFound();
    }

    throw error;
  });

  if (!cv || (cv.user?.id && cv.user.id !== userId)) {
    notFound();
  }

  return <CvDetails userId={userId} cv={cv} />;
}
