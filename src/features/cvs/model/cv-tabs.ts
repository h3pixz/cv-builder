export const CV_TABS = [
  { segment: "details", label: "Details" },
  { segment: "skills", label: "Skills" },
  { segment: "projects", label: "Projects" },
  { segment: "preview", label: "Preview" },
] as const;

export type CvTabSegment = (typeof CV_TABS)[number]["segment"];
