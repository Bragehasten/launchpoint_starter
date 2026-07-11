"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import {
  magicLinkSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/lib/validations/auth";

/**
 * Auth server actions. Every action:
 * 1. rate-limits by IP,
 * 2. validates input with Zod,
 * 3. returns a serializable ActionState for useActionState forms.
 */

export type ActionState = {
  status: "idle" | "error" | "success";
  /** Top-level message (auth failure, rate limit, success info). */
  message?: string;
  /** Per-field validation errors keyed by input name. */
  fieldErrors?: Record<string, string[] | undefined>;
};

async function limitByIp(action: string): Promise<ActionState | null> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await rateLimit(`auth:${action}:${ip}`, { limit: 10, windowMs: 60_000 });
  return success
    ? null
    : { status: "error", message: "Too many attempts. Please wait a minute and try again." };
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const limited = await limitByIp("sign-in");
  if (limited) return limited;

  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z_fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const limited = await limitByIp("sign-up");
  if (limited) return limited;

  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z_fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: "Could not create account. Please try again." };
  }

  redirect("/verify-email");
}

export async function signInWithMagicLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limited = await limitByIp("magic-link");
  if (limited) return limited;

  const parsed = magicLinkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z_fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  });

  if (error) {
    return { status: "error", message: "Could not send the link. Please try again." };
  }

  return { status: "success", message: "Check your email for a sign-in link." };
}

export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limited = await limitByIp("reset-password");
  if (limited) return limited;

  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z_fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
  });

  // Always report success — never reveal whether an email is registered.
  return {
    status: "success",
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z_fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: "error", message: "Could not update password. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Only allow internal redirects — never redirect to another origin. */
function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/account";
}

function z_fieldErrors(error: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
