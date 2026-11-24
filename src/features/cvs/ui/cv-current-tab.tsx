"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { CV_TABS } from "../model/cv-tabs";

export function CvCurrentTab() {
  const segment = useSelectedLayoutSegment();
  const label =
    CV_TABS.find((tab) => tab.segment === segment)?.label ?? CV_TABS[0].label;

  return <>{label}</>;
}
