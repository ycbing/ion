import { z } from "zod";

export const updateActiveProvidersSchema = z
  .object({
    text: z.string().trim().min(1, "text provider cannot be empty").optional(),
    image: z.string().trim().min(1, "image provider cannot be empty").optional()
  })
  .superRefine((value, ctx) => {
    if (!value.text && !value.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one provider must be specified",
        path: []
      });
    }
  });

export type UpdateActiveProvidersInput = z.infer<typeof updateActiveProvidersSchema>;
