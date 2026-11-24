import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ segment: "details" as string | null }));

vi.mock("next/navigation", () => ({
  useSelectedLayoutSegment: () => state.segment,
}));

import { CvTabs } from "./cv-tabs";

describe("CvTabs", () => {
  it("renders all CV tabs with links", () => {
    state.segment = "details";
    render(<CvTabs cvId="cv-1" />);

    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      "/cvs/cv-1/details",
    );
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute(
      "href",
      "/cvs/cv-1/skills",
    );
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/cvs/cv-1/projects",
    );
    expect(screen.getByRole("link", { name: "Preview" })).toHaveAttribute(
      "href",
      "/cvs/cv-1/preview",
    );
  });

  it("marks the active tab", () => {
    state.segment = "skills";
    render(<CvTabs cvId="cv-1" />);

    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Details" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
