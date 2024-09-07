import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters long"),
  description: z
    .string()
    .max(600, "Description must be at most 600 characters long")
    .optional(),
  isComplete: z.boolean(),
  userId: z.string().uuid(),
  tags: z.array(z.string()),
});
