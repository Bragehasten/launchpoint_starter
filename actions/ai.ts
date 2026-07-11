"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { extractJson, generate } from "@/lib/ai/client";
import { buildBusinessContext } from "@/lib/ai/context";
import { aiTasks, aiTaskKeys, type AiTaskKey } from "@/lib/ai/tasks";
import { requireRole } from "@/lib/auth";
import { createLogger } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const log = createLogger("ai-actions");

/**
 * Admin AI actions. Guardrails, in order:
 * 1. requireRole("editor") — never callable by the public
 * 2. per-user rate limit — a runaway click can't run up the bill
 * 3. every prompt carries the business context + voice rules
 * 4. output is ALWAYS a draft a human reviews — nothing auto-publishes
 */

export type AiResult = { success: true; text: string } | { success: false; message: string };

const runSchema = z.object({
  task: z.enum(aiTaskKeys as [AiTaskKey, ...AiTaskKey[]]),
  topic: z.string().min(1, "Give the task something to work with").max(8000),
  extra: z.string().max(4000).optional(),
});

type AiFailure = { success: false; message: string };

async function guard(): Promise<AiFailure | null> {
  const user = await requireRole("editor");
  const { success } = await rateLimit(`ai:${user.id}`, { limit: 10, windowMs: 60_000 });
  if (!success) {
    return { success: false, message: "AI rate limit reached — wait a minute and retry." };
  }
  return null;
}

export async function runAiTask(input: unknown): Promise<AiResult> {
  const limited = await guard();
  if (limited) return limited;

  const parsed = runSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const preset = aiTasks[parsed.data.task];
  const { system, prompt, maxTokens } = preset.build({
    topic: parsed.data.topic,
    extra: parsed.data.extra,
  });
  const context = await buildBusinessContext();

  return generate({
    system: `${system}\n\nBusiness context:\n${context}`,
    prompt,
    maxTokens,
  });
}

// ---------------------------------------------------------------------------
// One-click service-area draft: generates copy AND creates the row —
// inactive, so it never ships without a human reading it.
// ---------------------------------------------------------------------------

const areaDraftSchema = z.object({
  name: z.string().min(1).max(120),
  region: z.string().max(40).optional(),
  /** True local facts to anchor the copy (jobs done there, specialties…). */
  notes: z.string().max(2000).optional(),
});

const generatedAreaSchema = z.object({
  intro: z.string().min(40),
  body: z.string().min(1),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1),
});

export type AreaDraftResult = { success: true; slug: string } | { success: false; message: string };

export async function createServiceAreaDraft(input: unknown): Promise<AreaDraftResult> {
  const limited = await guard();
  if (limited) return limited;

  const parsed = areaDraftSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, region, notes } = parsed.data;
  const topic = region ? `${name}, ${region}` : name;
  const preset = aiTasks["service-area-copy"].build({ topic, extra: notes });
  const context = await buildBusinessContext();

  const result = await generate({
    system: `${preset.system}\n\nBusiness context:\n${context}`,
    prompt: preset.prompt,
    maxTokens: preset.maxTokens,
  });
  if (!result.success) return result;

  const copy = generatedAreaSchema.safeParse(extractJson(result.text));
  if (!copy.success) {
    log.warn("area draft: unparseable model output");
    return { success: false, message: "The draft came back malformed — try again." };
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const supabase = await createClient();
  const { error } = await supabase.from("service_areas").insert({
    name,
    slug,
    region: region || null,
    intro: copy.data.intro,
    body: copy.data.body,
    faqs: copy.data.faqs,
    active: false, // ALWAYS lands as a draft — publish is a human decision
    sort_order: 999,
  });
  if (error) {
    if (error.message.includes("duplicate key")) {
      return { success: false, message: `An area with slug "${slug}" already exists.` };
    }
    log.error("area draft insert failed", { error: error.message });
    return { success: false, message: "Could not save the draft — try again." };
  }

  revalidatePath("/admin/service-areas");
  return { success: true, slug };
}
