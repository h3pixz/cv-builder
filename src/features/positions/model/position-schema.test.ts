import { describe, expect, it } from "vitest";

import {
  POSITION_MESSAGES,
  POSITION_NAME_MAX,
  catalogPositionSchema,
} from "./position-schema";

describe("catalogPositionSchema", () => {
  it("accepts a position name and trims it", () => {
    const parsed = catalogPositionSchema.parse({ name: "  Developer  " });

    expect(parsed).toEqual({ name: "Developer" });
  });

  it("requires the position name", () => {
    const result = catalogPositionSchema.safeParse({ name: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      POSITION_MESSAGES.nameRequired,
    );
  });

  it("limits the name length", () => {
    const result = catalogPositionSchema.safeParse({
      name: "a".repeat(POSITION_NAME_MAX + 1),
    });

    expect(result.error?.issues[0]?.message).toBe(
      POSITION_MESSAGES.nameTooLong,
    );
  });
});
