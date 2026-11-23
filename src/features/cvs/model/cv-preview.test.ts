import { describe, expect, it } from "vitest";

import {
  buildCvPreview,
  buildCvPreviewHtml,
  formatPeriod,
  isPreviewAvailable,
  toPdfFileName,
  type CvPreviewSource,
} from "./cv-preview";

const NOW = new Date(2026, 10, 20);

const categories = [
  {
    id: "cat-frontend",
    name: "Frontend technologies",
    order: 1,
    children: [],
  },
  {
    id: "cat-empty",
    name: "Databases",
    order: 2,
    children: [],
  },
];

const source: CvPreviewSource = {
  name: "Software Engineer With 5+ Years Of Experience",
  education: "Computer Systems Design",
  description: "Highly motivated and experienced Software Engineer.",
  skills: [
    { name: "React", categoryId: "cat-frontend", mastery: "Expert" },
    { name: "TypeScript", categoryId: "cat-frontend", mastery: "Proficient" },
    { name: "Angular", categoryId: "cat-frontend", mastery: "Novice" },
  ],
  projects: [
    {
      name: "SAAS Media Platform",
      description: "A digital music, podcast, and video service.",
      domain: "IoT",
      start_date: "2022-03-01",
      end_date: "2023-12-01",
      environment: ["React", "JavaScript"],
      roles: ["Frontend Developer", "AI Developer"],
      responsibilities: ["Integrated Keycloak OAuth SSO."],
    },
    {
      name: "Smart Home Hub",
      description: "A hub for smart home devices.",
      domain: "iot",
      start_date: "2023-06-01",
      end_date: null,
      environment: ["TypeScript", "Node.js", "React"],
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
      languages: [
        { name: "English", proficiency: "C1" },
        { name: "German", proficiency: "B2" },
      ],
    },
  },
};

describe("formatPeriod", () => {
  it("formats month and year for both dates", () => {
    expect(formatPeriod("2022-03-01", "2023-12-01")).toBe("03.2022 - 12.2023");
  });

  it("uses Present when the end date is missing", () => {
    expect(formatPeriod("2023-06-01", null)).toBe("06.2023 - Present");
  });
});

describe("buildCvPreview", () => {
  it("builds the header and general information", () => {
    const preview = buildCvPreview(source, categories, NOW);

    expect(preview.fullName).toBe("Rostislav Harlanov");
    expect(preview.position).toBe("Software Engineer");
    expect(preview.education).toBe("Computer Systems Design");
    expect(preview.languages).toEqual([
      { name: "English", proficiency: "C1" },
      { name: "German", proficiency: "B2" },
    ]);
    expect(preview.domains).toEqual(["IoT"]);
  });

  it("groups CV skills by category and skips empty categories", () => {
    const preview = buildCvPreview(source, categories, NOW);

    expect(preview.skillGroups).toHaveLength(1);
    expect(preview.skillGroups[0]).toMatchObject({
      id: "cat-frontend",
      name: "Frontend technologies",
    });
    expect(preview.skillGroups[0].skills.map((skill) => skill.name)).toEqual([
      "React",
      "TypeScript",
      "Angular",
    ]);
  });

  it("maps projects with their periods and optional sections", () => {
    const preview = buildCvPreview(source, categories, NOW);

    expect(preview.projects[0]).toMatchObject({
      name: "SAAS Media Platform",
      period: "03.2022 - 12.2023",
      roles: ["Frontend Developer", "AI Developer"],
      responsibilities: ["Integrated Keycloak OAuth SSO."],
      environment: ["React", "JavaScript"],
    });
    expect(preview.projects[1]).toMatchObject({
      period: "06.2023 - Present",
      roles: [],
      responsibilities: [],
    });
  });

  it("calculates experience and last used from project environments", () => {
    const preview = buildCvPreview(source, categories, NOW);
    const rows = preview.professionalSkills[0].rows;

    expect(rows).toEqual([
      { name: "React", experienceYears: 4, lastUsed: 2026 },
      { name: "TypeScript", experienceYears: 3, lastUsed: 2026 },
      { name: "Angular", experienceYears: null, lastUsed: null },
    ]);
  });

  it("rounds experience down to full years", () => {
    const preview = buildCvPreview(
      {
        ...source,
        projects: [
          {
            name: "One",
            description: "One",
            domain: "IoT",
            start_date: "2020-12-01",
            end_date: "2021-12-01",
            environment: ["React"],
            roles: [],
            responsibilities: [],
          },
        ],
      },
      categories,
      NOW,
    );

    expect(
      preview.professionalSkills[0].rows.find((row) => row.name === "React")
        ?.experienceYears,
    ).toBe(5);
  });

  it("falls back to full_name when first and last names are empty", () => {
    const preview = buildCvPreview(
      {
        ...source,
        user: {
          position: { name: "Software Engineer" },
          profile: {
            first_name: null,
            last_name: null,
            full_name: "Rostislav Harlanov",
            languages: [],
          },
        },
      },
      categories,
      NOW,
    );

    expect(preview.fullName).toBe("Rostislav Harlanov");
  });
});

describe("isPreviewAvailable", () => {
  it("requires only the employee name", () => {
    const preview = buildCvPreview(source, categories, NOW);

    expect(isPreviewAvailable(preview)).toBe(true);
    expect(isPreviewAvailable({ ...preview, fullName: "" })).toBe(false);
    expect(isPreviewAvailable({ ...preview, position: null })).toBe(true);
  });
});

describe("buildCvPreviewHtml", () => {
  it("escapes user content", () => {
    const preview = buildCvPreview(
      {
        ...source,
        name: "<script>alert(1)</script>",
        description: "Description & <b>markup</b>",
      },
      categories,
      NOW,
    );
    const html = buildCvPreviewHtml(preview);

    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Description &amp; &lt;b&gt;markup&lt;/b&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("includes every preview section", () => {
    const html = buildCvPreviewHtml(buildCvPreview(source, categories, NOW));

    expect(html).toContain("Rostislav Harlanov");
    expect(html).toContain("Education");
    expect(html).toContain("English — C1");
    expect(html).toContain("Projects");
    expect(html).toContain("Project roles");
    expect(html).toContain("Present");
    expect(html).toContain("Professional skills");
    expect(html).toContain("Experience in Years");
    expect(html).toContain("Last Used");
  });
});

describe("toPdfFileName", () => {
  it("builds a slug from the CV name", () => {
    expect(
      toPdfFileName("Software Engineer With 5+ Years Of Experience"),
    ).toBe("software-engineer-with-5-years-of-experience.pdf");
  });

  it("keeps unicode letters and falls back for empty names", () => {
    expect(toPdfFileName("Резюме №1")).toBe("резюме-1.pdf");
    expect(toPdfFileName("   ")).toBe("cv.pdf");
  });
});
