import { z } from "zod";

export type ProjectBounds = {
  startDate: string;
  endDate: string | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const baseProjectSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  startDate: z.string().regex(ISO_DATE, "Start date is required"),
  endDate: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, "End date is invalid"),
  roles: z.array(z.string().min(1)).min(1, "At least one role must be selected"),
  responsibilities: z.string(),
});

export type CvProjectValues = z.infer<typeof baseProjectSchema>;

export function createCvProjectSchema(bounds: ProjectBounds | null) {
  return baseProjectSchema.superRefine((values, ctx) => {
    if (!bounds) {
      return;
    }

    if (values.startDate < bounds.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date must be within project duration",
      });
    }

    if (bounds.endDate && values.startDate > bounds.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date must be within project duration",
      });
    }

    if (values.endDate) {
      if (values.endDate < values.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date cannot be earlier than start date",
        });
      }

      if (values.endDate < bounds.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be within project duration",
        });
      }

      if (bounds.endDate && values.endDate > bounds.endDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be within project duration",
        });
      }
    }
  });
}

export function splitResponsibilities(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
