import { z } from "zod";

export function createLevelFormSchema(messages: {
  nameRequired: string;
  levelRequired: string;
}) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired),
    mastery: z.string().min(1, messages.levelRequired),
  });
}

export type LevelFormValues = z.infer<
  ReturnType<typeof createLevelFormSchema>
>;
