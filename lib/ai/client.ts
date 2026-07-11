import "server-only";

import { env } from "@/lib/env";
import { createLogger } from "@/lib/log";

const log = createLogger("ai");

/**
 * Anthropic Messages API via plain fetch — no SDK dependency for one
 * endpoint. Server-only by import guard; the key never leaves the server.
 *
 * Every framework AI feature goes through generate(), so usage policy
 * (model choice, token caps, logging) lives in exactly one place.
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const TIMEOUT_MS = 60_000;

export function aiEnabled(): boolean {
  return Boolean(env.ANTHROPIC_API_KEY);
}

export type GenerateOptions = {
  system: string;
  prompt: string;
  maxTokens?: number;
};

export type GenerateResult = { success: true; text: string } | { success: false; message: string };

export async function generate({
  system,
  prompt,
  maxTokens = 1500,
}: GenerateOptions): Promise<GenerateResult> {
  if (!env.ANTHROPIC_API_KEY) {
    return {
      success: false,
      message: "AI is not configured — add ANTHROPIC_API_KEY to .env.local.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": API_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      log.error("api error", { status: response.status, body: body.slice(0, 300) });
      return {
        success: false,
        message:
          response.status === 401
            ? "AI request failed: check ANTHROPIC_API_KEY."
            : `AI request failed (${response.status}) — try again.`,
      };
    }

    const payload = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = (payload.content ?? [])
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!text) return { success: false, message: "AI returned an empty response — try again." };
    return { success: true, text };
  } catch (error) {
    log.error("request threw", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, message: "AI request timed out or failed — try again." };
  }
}

/**
 * Extracts a JSON payload from a model response that may wrap it in a code
 * fence or lead-in sentence. Returns null when nothing parseable is found.
 */
export function extractJson<T>(text: string): T | null {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.search(/[[{]/);
  if (start === -1) return null;
  try {
    return JSON.parse(candidate.slice(start)) as T;
  } catch {
    return null;
  }
}
