import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .max(300, { message: "Title must not exceed 300 characters" }),
  description: z
    .string()
    .max(600, { message: "Description must not exceed 600 characters" })
    .nullable().optional(),
  isComplete: z.boolean(),
  userId: z
    .string()
    .uuid({ message: "Invalid userId format. Must be a valid UUID." }),
  tags: z.array(z.string()),
});

export const userSchema = z.object({
  username: z
    .string()
    .max(255, { message: "Username must not exceed 255 characters" }),
  firstName: z
    .string()
    .max(255, { message: "First name must not exceed 255 characters" }),
  lastName: z
    .string()
    .max(255, { message: "Last name must not exceed 255 characters" })
    .nullable().optional(),
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .max(300, { message: "Email must not exceed 300 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  todos: z.array(todoSchema).nullable().optional(),
});

export const userSignInSchema = z
  .object({
    username: z.string().min(1, "Username cannot be empty").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided",
  });