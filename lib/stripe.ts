import "server-only";

import Stripe from "stripe";

import { env } from "@/lib/env";
import { createLogger } from "@/lib/log";

const log = createLogger("stripe");

/**
 * Lazy Stripe client. Null until STRIPE_SECRET_KEY is configured, so the
 * kit builds and runs without a Stripe account; payment entry points check
 * and return a clear error instead.
 */

let client: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (client !== undefined) return client;
  client = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;
  if (!client) {
    log.warn("STRIPE_SECRET_KEY not set — payments are disabled.");
  }
  return client;
}
