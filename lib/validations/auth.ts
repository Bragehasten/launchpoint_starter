import { z } from "zod";

/** Shared auth validation schemas — used by server actions and forms. */

export const emailSchema = z.email({ error: "Enter a valid email address" });

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100),
  email: emailSchema,
  password: passwordSchema,
});

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z.object({
  password: passwordSchema,
});
