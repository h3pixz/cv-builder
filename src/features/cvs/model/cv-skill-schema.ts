import { z } from "zod";

export const cvSkillSchema = z.object({
  name: z.string().trim().min(1, "Skill is required"),
});

export type CvSkillValues = z.infer<typeof cvSkillSchema>;
