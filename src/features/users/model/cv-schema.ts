import { z } from "zod";

/** The backend accepts education as optional, but the UI requires it. */
export const CV_TEXT_MAX = 255;

export const cvSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(CV_TEXT_MAX, `Name must be at most ${CV_TEXT_MAX} characters`),
  education: z
    .string()
    .trim()
    .min(1, "Education is required")
    .max(CV_TEXT_MAX, `Education must be at most ${CV_TEXT_MAX} characters`),
  description: z.string().trim().min(1, "Description is required"),
});

export type CvValues = z.infer<typeof cvSchema>;
