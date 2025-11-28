import { z } from "zod";

const aspectRatioRegex = /^\d{1,2}:\d{1,2}$/;

export const generateImageSchema = z.object({
  provider: z.string().trim().min(1).optional(),
  copy: z
    .string()
    .trim()
    .min(1, "copy must contain at least 1 character")
    .max(2000, "copy cannot exceed 2000 characters"),
  style: z
    .object({
      palette: z
        .array(z.string().trim().min(1))
        .min(1, "palette must include at least one entry")
        .max(8, "palette cannot exceed 8 colors")
        .optional(),
      medium: z.string().trim().min(1).max(48).optional(),
      mood: z.string().trim().min(1).max(48).optional(),
      aspectRatio: z
        .string()
        .trim()
        .regex(aspectRatioRegex, "aspectRatio must follow the pattern W:H (e.g. 16:9)")
        .optional()
    })
    .optional()
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
