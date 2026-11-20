import { z } from "zod";

/**
 * Builds the client-side level form schema. Messages are plain strings so the
 * server page can pass them into the client `LevelManager`.
 */
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
