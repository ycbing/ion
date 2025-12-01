import { z } from "zod";

const keywordsSchema = z
  .array(z.string().min(1, "keywords must contain characters"))
  .max(12, "keywords cannot exceed 12 items");

export const generateCopySchema = z.object({
  provider: z.string().trim().min(1).optional(),
  topic: z.string().trim().min(3, "topic must contain at least 3 characters"),
  prompt: z
    .string()
    .trim()
    .min(1, "prompt must contain at least 1 character")
    .max(2000, "prompt cannot exceed 2000 characters")
    .optional(),
  options: z
    .object({
      tone: z.string().trim().min(1).optional(),
      audience: z.string().trim().min(1).optional(),
      keywords: keywordsSchema.optional(),
      language: z
        .string()
        .trim()
        .min(2, "language must be at least 2 characters")
        .max(8, "language cannot exceed 8 characters")
        .optional(),
      variants: z
        .number()
        .int("variants must be an integer")
        .min(1, "variants must be at least 1")
        .max(5, "variants cannot exceed 5")
        .optional()
    })
    .optional()
});

export type GenerateCopyInput = z.infer<typeof generateCopySchema>;
