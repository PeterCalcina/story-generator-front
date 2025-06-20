import * as z from "zod";

export const BaseImageStorySchema = z.object({
  originalImage: z.string(),
  createdImage: z.string(),
  pdfUrl: z.string(),
  story: z.string(),
  phoneNumber: z.string(),
  createdAt: z.date(),
});

export const createImageStorySchema = BaseImageStorySchema.pick({
  originalImage: true,
  createdImage: true,
  pdfUrl: true,
  story: true,
  phoneNumber: true,
  createdAt: true,
});

export type CreateImageStoryDto = z.infer<typeof createImageStorySchema>;






