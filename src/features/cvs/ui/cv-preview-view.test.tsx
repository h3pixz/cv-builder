import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { buildCvPreview, type CvPreviewSource } from "../model/cv-preview";
import { CvPreviewView } from "./cv-preview-view";

vi.mock("../api/cv-preview.actions", () => ({
  exportCvPdfAction: vi.fn(),
}));

const NOW = new Date(2026, 10, 20);

const categories = [
  { id: "cat-frontend", name: "Frontend technologies", order: 1, children: [] },
];

const source: CvPreviewSource = {
  name: "Software Engineer With 5+ Years Of Experience",
  education: "Computer Systems Design",
  description: "Highly motivated Software Engineer.",
  skills: [
    { name: "React", categoryId: "cat-frontend", mastery: "Expert" },
    { name: "TypeScript", categoryId: "cat-frontend", mastery: "Proficient" },
  ],
  projects: [
    {
      name: "SAAS Media Platform",
      description: "A digital music service.",
      domain: "IoT",
      start_date: "2022-03-01",
      end_date: "2023-12-01",
      environment: ["React", "TypeScript"],
      roles: ["Frontend Developer"],
      responsibilities: ["Integrated Keycloak OAuth SSO."],
    },
    {
      name: "Smart Home Hub",
      description: "A hub for smart home devices.",
      domain: "IoT",
      start_date: "2024-01-01",
      end_date: null,
      environment: [],
      roles: [],
      responsibilities: [],
    },
  ],
  user: {
    position: { name: "Software Engineer" },
    profile: {
      first_name: "Rostislav",
      last_name: "Harlanov",
      full_name: "Rostislav Harlanov",
      languages: [{ name: "English", proficiency: "C1" }],
    },
  },
};

describe("CvPreviewView", () => {
  it("renders the resume header and general information", () => {
    render(
      <CvPreviewView
        cvId="cv-1"
        preview={buildCvPreview(source, categories, NOW)}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Rostislav Harlanov" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Computer Systems Design")).toBeInTheDocument();
    expect(screen.getByText("English — C1")).toBeInTheDocument();
    expect(screen.getByText("IoT")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export PDF" }),
    ).toBeEnabled();
  });

  it("renders the summary, skills and projects", () => {
    render(
      <CvPreviewView
        cvId="cv-1"
        preview={buildCvPreview(source, categories, NOW)}
      />,
    );

    expect(
      screen.getByRole("heading", { name: source.name }),
    ).toBeInTheDocument();
    expect(screen.getByText("React, TypeScript.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "SAAS Media Platform" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("03.2022 - 12.2023")).toBeInTheDocument();
    expect(screen.getByText("01.2024 - Present")).toBeInTheDocument();
    expect(
      screen.getByText("Integrated Keycloak OAuth SSO."),
    ).toBeInTheDocument();
  });

  it("hides empty role and responsibility sections", () => {
    const preview = buildCvPreview(source, categories, NOW);

    render(<CvPreviewView cvId="cv-1" preview={preview} />);

    const hub = screen
      .getByRole("heading", { name: "Smart Home Hub" })
      .closest("div")?.parentElement;

    expect(hub).not.toBeNull();
    expect(within(hub as HTMLElement).queryByText("Project roles")).toBeNull();
    expect(
      within(hub as HTMLElement).queryByText("Responsibilities"),
    ).toBeNull();
  });

  it("renders the professional skills table", () => {
    render(
      <CvPreviewView
        cvId="cv-1"
        preview={buildCvPreview(source, categories, NOW)}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: "Skills Category" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Experience in Years" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Last Used" }),
    ).toBeInTheDocument();

    const reactRow = screen.getByRole("cell", { name: "React" }).closest("tr");
    expect(reactRow).not.toBeNull();
    expect(within(reactRow as HTMLElement).getByText("4")).toBeInTheDocument();
    expect(within(reactRow as HTMLElement).getByText("2023")).toBeInTheDocument();
  });

  it("renders without a position", () => {
    const preview = buildCvPreview(
      { ...source, user: { position: null, profile: source.user?.profile } },
      categories,
      NOW,
    );

    render(<CvPreviewView cvId="cv-1" preview={preview} />);

    expect(
      screen.getByRole("heading", { name: "Rostislav Harlanov" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export PDF" }),
    ).toBeEnabled();
  });

  it("shows the empty state and disables the export", () => {
    const preview = buildCvPreview(
      {
        ...source,
        user: {
          position: source.user?.position ?? null,
          profile: {
            first_name: null,
            last_name: null,
            full_name: null,
            languages: [],
          },
        },
      },
      categories,
      NOW,
    );

    render(<CvPreviewView cvId="cv-1" preview={preview} />);

    expect(screen.getByText("CV preview is not available")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export PDF" }),
    ).toBeDisabled();
  });
});
