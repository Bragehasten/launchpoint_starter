import { env } from "@/lib/env";
import { createLogger } from "@/lib/log";

/**
 * Rate limiting with two backends behind one call:
 *
 * - **Upstash Redis** (when UPSTASH_REDIS_REST_URL/TOKEN are set): a fixed
 *   window shared across all serverless instances and regions. Uses the
 *   plain REST pipeline endpoint — no SDK dependency for two commands.
 * - **In-memory sliding window** (default): correct for a single instance;
 *   on serverless it limits per-instance, which still blunts bursts.
 *
 * The Redis path fails OPEN: if Upstash is unreachable, requests are
 * allowed and the failure is logged. For contact forms and booking
 * requests, availability beats strictness — the honeypot and validation
 * layers still stand.
 */

const log = createLogger("rate-limit");

type RateLimitOptions = {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
};

// ---------------------------------------------------------------------------
// Upstash Redis backend (fixed window: INCR + PEXPIRE NX per key)
// ---------------------------------------------------------------------------

async function upstashRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<RateLimitResult> {
  const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", `rl:${key}`],
      // NX: only set the expiry when the key is new, so the window is fixed
      // from the first request rather than sliding on every hit.
      ["PEXPIRE", `rl:${key}`, windowMs, "NX"],
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash responded ${response.status}`);
  }

  const [incr] = (await response.json()) as [{ result: number }, { result: number }];
  const count = incr.result;

  return { success: count <= limit, remaining: Math.max(0, limit - count) };
}

// ---------------------------------------------------------------------------
// In-memory backend (sliding window)
// ---------------------------------------------------------------------------

type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();

/** Periodically drop empty buckets so the map can't grow unbounded. */
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function memoryRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [k, bucket] of store) {
      if (bucket.timestamps.every((t) => now - t > windowMs)) store.delete(k);
    }
    lastCleanup = now;
  }

  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    store.set(key, bucket);
    return { success: false, remaining: 0 };
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);
  return { success: true, remaining: limit - bucket.timestamps.length };
}

// ---------------------------------------------------------------------------

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await upstashRateLimit(key, options);
    } catch (error) {
      log.error("upstash unreachable — failing open", {
        error: error instanceof Error ? error.message : String(error),
      });
      return { success: true, remaining: 1 };
    }
  }

  return memoryRateLimit(key, options);
}
