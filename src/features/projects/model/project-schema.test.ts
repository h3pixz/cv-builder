import { describe, expect, it } from "vitest";

import {
  PROJECT_DESCRIPTION_MAX,
  PROJECT_DOMAIN_MAX,
  PROJECT_MESSAGES,
  PROJECT_NAME_MAX,
  projectSchema,
} from "./project-schema";

const valid = {
  name: "CV Builder",
  domain: "cv-builder.example.com",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  description: "An internal resume builder.",
  environment: ["React", "TypeScript"],
};

describe("projectSchema", () => {
  it("accepts a project and trims the text fields", () => {
    const parsed = projectSchema.parse({
      ...valid,
      name: "  CV Builder  ",
      domain: "  cv-builder.example.com  ",
      description: "  An internal resume builder.  ",
    });

    expect(parsed).toEqual(valid);
  });

  it("requires the name", () => {
    const result = projectSchema.safeParse({ ...valid, name: "   " });

    expect(result.error?.issues[0]?.message).toBe(
      PROJECT_MESSAGES.nameRequired,
    );
  });

  it("limits the name length", () => {
    const result = projectSchema.safeParse({
      ...valid,
      name: "a".repeat(PROJECT_NAME_MAX + 1),
    });

    expect(result.error?.issues[0]?.message).toBe(
      PROJECT_MESSAGES.nameTooLong,
    );
  });

  it("requires the domain", () => {
    const result = projectSchema.safeParse({ ...valid, domain: "" });

    expect(result.error?.issues[0]?.message).toBe(
      PROJECT_MESSAGES.domainRequired,
    );
  });

  it("limits the domain length", () => {
    const result = projectSchema.safeParse({
      ...valid,
      domain: "a".repeat(PROJECT_DOMAIN_MAX + 1),
    });

    expect(result.error?.issues[0]?.message).toBe(
      PROJECT_MESSAGES.domainTooLong,
    );
  });

  it("requires both dates", () => {
    expect(
      projectSchema.safeParse({ ...valid, startDate: "" }).error?.issues[0]
        ?.message,
    ).toBe(PROJECT_MESSAGES.startDateRequired);

    expect(
      projectSchema.safeParse({ ...valid, endDate: "" }).error?.issues[0]
        ?.message,
    ).toBe(PROJECT_MESSAGES.endDateRequired);
  });

  it("requires the description and limits its length", () => {
    expect(
      projectSchema.safeParse({ ...valid, description: "  " }).error?.issues[0]
        ?.message,
    ).toBe(PROJECT_MESSAGES.descriptionRequired);

    expect(
      projectSchema.safeParse({
        ...valid,
        description: "a".repeat(PROJECT_DESCRIPTION_MAX + 1),
      }).error?.issues[0]?.message,
    ).toBe(PROJECT_MESSAGES.descriptionTooLong);
  });

  it("rejects an end date earlier than the start date", () => {
    const result = projectSchema.safeParse({
      ...valid,
      startDate: "2025-12-31",
      endDate: "2025-01-01",
    });

    expect(result.error?.issues[0]?.path).toEqual(["endDate"]);
    expect(result.error?.issues[0]?.message).toBe(
      PROJECT_MESSAGES.endDateBeforeStart,
    );
  });

  it("allows the end date to equal the start date", () => {
    const result = projectSchema.safeParse({
      ...valid,
      startDate: "2025-05-01",
      endDate: "2025-05-01",
    });

    expect(result.success).toBe(true);
  });
});
