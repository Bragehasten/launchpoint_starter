import { z } from "zod";

/**
 * Environment variable validation.
 *
 * Every env var the app depends on is declared here with a Zod schema.
 * The app fails fast at boot with a readable error instead of crashing at
 * runtime deep inside a feature.
 *
 * Server-only variables must NEVER be prefixed with NEXT_PUBLIC_.
 * As milestones land (Stripe, Resend), extend these schemas.
 */

/**
 * Dotenv represents an unset optional var as an empty string (`FOO=`), which
 * is a *defined* value and would fail `.startsWith(...)` checks. Coerce empty
 * strings to undefined so "present but blank" is treated the same as "unset".
 */
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /**
   * Email is optional so the kit boots without a Resend account:
   * lib/email logs a warning and skips sending when the key is missing.
   */
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  /** Verified sender, e.g. "LaunchPoint <hello@yourdomain.com>". */
  EMAIL_FROM: z.string().default("onboarding@resend.dev"),
  /** Where contact-form notifications are delivered. */
  CONTACT_EMAIL: z.preprocess(emptyToUndefined, z.email().optional()),
  /**
   * Stripe (optional until configured): payments degrade to a clear
   * "not configured" error instead of breaking the build.
   */
  STRIPE_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().startsWith("sk_").optional()),
  STRIPE_WEBHOOK_SECRET: z.preprocess(emptyToUndefined, z.string().startsWith("whsec_").optional()),
  /**
   * Service-role key — server-only, bypasses RLS. Used exclusively by the
   * Stripe webhook to record verified payments (and future admin jobs).
   */
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  /**
   * Upstash Redis (optional): when both are set, rate limiting is shared
   * across all serverless instances; otherwise it falls back to in-memory.
   */
  UPSTASH_REDIS_REST_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  UPSTASH_REDIS_REST_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  /**
   * Anthropic API (optional): powers admin content generation (AI Studio).
   * Absent = AI features show a clear "not configured" message.
   */
  ANTHROPIC_API_KEY: z.preprocess(emptyToUndefined, z.string().startsWith("sk-ant-").optional()),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-5"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url({ error: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL" }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

/**
 * Next.js inlines NEXT_PUBLIC_* vars at build time, so client vars must be
 * referenced explicitly — process.env cannot be enumerated in the browser.
 */
const clientRuntime: Record<keyof z.infer<typeof clientSchema>, string | undefined> = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

function formatErrors(error: z.ZodError): string {
  return error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
}

function validate() {
  const isServer = typeof window === "undefined";

  const clientParsed = clientSchema.safeParse(clientRuntime);
  if (!clientParsed.success) {
    throw new Error(
      `❌ Invalid client environment variables:\n${formatErrors(clientParsed.error)}`,
    );
  }

  if (!isServer) {
    return { ...clientParsed.data } as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
  }

  const serverParsed = serverSchema.safeParse(process.env);
  if (!serverParsed.success) {
    throw new Error(
      `❌ Invalid server environment variables:\n${formatErrors(serverParsed.error)}`,
    );
  }

  return { ...serverParsed.data, ...clientParsed.data };
}

/** Validated, typed environment. Import this instead of process.env. */
export const env = validate();
