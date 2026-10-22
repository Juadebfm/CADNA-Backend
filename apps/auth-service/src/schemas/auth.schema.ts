import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required and must be minimum of 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(6, "Password is required and must be minimum of 6 characters"),
});
export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(6, "Password is required and must be minimum of 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
