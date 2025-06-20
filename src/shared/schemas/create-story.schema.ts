import * as z from "zod";

export const createStorySchema = z.object({
  image: z.instanceof(File),
  description: z.string().min(1, "La descripción es requerida"),
});

export type CreateStorySchema = z.infer<typeof createStorySchema>;