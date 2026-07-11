import { z } from "zod";

/**
 * Newsletter schema (footer widget). All other public forms are defined in
 * config/forms.ts and validated by lib/forms/schema.ts (the forms engine).
 */

export const newsletterSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
