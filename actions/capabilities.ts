"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Capability content CRUD. Explicit per-entity schemas keep the compiler
 * honest end-to-end; the admin UI stays generic (components/admin/crud).
 * Every action revalidates its public capability route.
 */

export type CrudResult = { success: boolean; message?: string };

function fail(message?: string): CrudResult {
  return { success: false, message: message ?? "Something went wrong." };
}

const id = z.uuid();
const optionalString = z
  .string()
  .max(2000)
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : null));

/** "" or missing -> null; otherwise a finite number. */
const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? null : Number(v)),
  z.number().finite().nullable(),
);

// Team ------------------------------------------------------------------

const teamMemberSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  bio: optionalString,
  image: optionalString,
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertTeamMember(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = teamMemberSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("team_members").update(parsed.data).eq("id", recordId)
    : await supabase.from("team_members").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/team");
  revalidatePath("/admin/team");
  return { success: true };
}

export async function deleteTeamMember(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  if (!id.safeParse(recordId).success) return fail("Invalid id.");
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", recordId);
  if (error) return fail(error.message);
  revalidatePath("/team");
  revalidatePath("/admin/team");
  return { success: true };
}

// Services ----------------------------------------------------------------

const serviceGroupSchema = z.object({
  name: z.string().min(1).max(120),
  description: optionalString,
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertServiceGroup(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = serviceGroupSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("service_groups").update(parsed.data).eq("id", recordId)
    : await supabase.from("service_groups").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/menu");
  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteServiceGroup(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  if (!id.safeParse(recordId).success) return fail("Invalid id.");
  const supabase = await createClient();
  const { error } = await supabase.from("service_groups").delete().eq("id", recordId);
  if (error) return fail(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/services");
  return { success: true };
}

const serviceSchema = z.object({
  group_id: z.uuid({ error: "Pick a group" }),
  name: z.string().min(1).max(160),
  description: optionalString,
  /** Dollars in the UI; stored as cents. Empty = market price. */
  price: z
    .number()
    .min(0)
    .max(1_000_000)
    .nullable()
    .transform((value) => (value === null ? null : Math.round(value * 100))),
  price_note: optionalString,
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertService(recordId: string | null, values: unknown): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("services").update(parsed.data).eq("id", recordId)
    : await supabase.from("services").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/menu");
  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteService(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  if (!id.safeParse(recordId).success) return fail("Invalid id.");
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", recordId);
  if (error) return fail(error.message);
  revalidatePath("/menu");
  revalidatePath("/admin/services");
  return { success: true };
}

// Locations -----------------------------------------------------------------

const hoursEntry = z.object({ days: z.string().min(1), hours: z.string().min(1) });

const locationSchema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().min(1).max(300),
  phone: optionalString,
  email: optionalString,
  /** JSON text in the UI, validated into structured hours. */
  hours: z
    .string()
    .optional()
    .transform((raw, ctx) => {
      if (!raw?.trim()) return [];
      try {
        const parsed = z.array(hoursEntry).parse(JSON.parse(raw));
        return parsed;
      } catch {
        ctx.addIssue({
          code: "custom",
          message: 'Hours must be JSON like [{"days":"Mon–Fri","hours":"9:00–18:00"}]',
        });
        return z.NEVER;
      }
    }),
  map_url: optionalString,
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only"),
  intro: optionalString,
  map_embed_url: optionalString,
  latitude: optionalNumber,
  longitude: optionalNumber,
  city: optionalString,
  region: optionalString,
  postal_code: optionalString,
  is_primary: z.boolean(),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertLocation(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = locationSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("locations").update(parsed.data).eq("id", recordId)
    : await supabase.from("locations").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/locations");
  revalidatePath(`/locations/${parsed.data.slug}`);
  revalidatePath("/admin/locations");
  return { success: true };
}

export async function deleteLocation(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  if (!id.safeParse(recordId).success) return fail("Invalid id.");
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", recordId);
  if (error) return fail(error.message);
  revalidatePath("/locations");
  revalidatePath("/admin/locations");
  return { success: true };
}

// Promotions -------------------------------------------------------------------

const promotionSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(2000),
  badge: optionalString,
  starts_at: optionalString,
  ends_at: optionalString,
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertPromotion(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = promotionSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("promotions").update(parsed.data).eq("id", recordId)
    : await supabase.from("promotions").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/specials");
  revalidatePath("/admin/promotions");
  return { success: true };
}

export async function deletePromotion(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  if (!id.safeParse(recordId).success) return fail("Invalid id.");
  const supabase = await createClient();
  const { error } = await supabase.from("promotions").delete().eq("id", recordId);
  if (error) return fail(error.message);
  revalidatePath("/specials");
  revalidatePath("/admin/promotions");
  return { success: true };
}

const locationReviewSchema = z.object({
  location_id: z.uuid({ error: "Pick a location" }),
  author: z.string().min(1).max(120),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(1).max(2000),
  source: z.string().min(1).max(40),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertLocationReview(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = locationReviewSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("location_reviews").update(parsed.data).eq("id", recordId)
    : await supabase.from("location_reviews").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/locations", "layout");
  revalidatePath("/admin/locations");
  return { success: true };
}

export async function deleteLocationReview(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  const supabase = await createClient();
  const { error } = await supabase.from("location_reviews").delete().eq("id", recordId);
  if (error) return fail(error.message);

  revalidatePath("/locations", "layout");
  revalidatePath("/admin/locations");
  return { success: true };
}

const faqEntry = z.object({ question: z.string().min(1), answer: z.string().min(1) });

const serviceAreaSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only"),
  region: optionalString,
  intro: z.string().min(40, "Write at least a sentence or two — unique copy per area is the point"),
  body: optionalString,
  /** JSON text in the UI, validated into structured FAQs. */
  faqs: z
    .string()
    .optional()
    .transform((raw, ctx) => {
      if (!raw?.trim()) return [];
      try {
        return z.array(faqEntry).parse(JSON.parse(raw));
      } catch {
        ctx.addIssue({
          code: "custom",
          message: 'FAQs must be JSON like [{"question":"…","answer":"…"}]',
        });
        return z.NEVER;
      }
    }),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function upsertServiceArea(
  recordId: string | null,
  values: unknown,
): Promise<CrudResult> {
  await requireRole("editor");
  const parsed = serviceAreaSchema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message);

  const supabase = await createClient();
  const { error } = recordId
    ? await supabase.from("service_areas").update(parsed.data).eq("id", recordId)
    : await supabase.from("service_areas").insert(parsed.data);
  if (error) return fail(error.message);

  revalidatePath("/service-areas", "layout");
  revalidatePath("/admin/service-areas");
  return { success: true };
}

export async function deleteServiceArea(recordId: string): Promise<CrudResult> {
  await requireRole("editor");
  const supabase = await createClient();
  const { error } = await supabase.from("service_areas").delete().eq("id", recordId);
  if (error) return fail(error.message);

  revalidatePath("/service-areas", "layout");
  revalidatePath("/admin/service-areas");
  return { success: true };
}
