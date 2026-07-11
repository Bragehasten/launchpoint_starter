import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { createLogger } from "@/lib/log";

const log = createLogger("stripe-webhook");
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/json";

/**
 * Stripe webhook. Security model:
 * 1. Signature verification — only Stripe can invoke meaningful work.
 * 2. Idempotency — payments upsert on stripe_session_id, so Stripe's
 *    at-least-once delivery can't create duplicates.
 * 3. Writes use the service-role client because this route has no user
 *    session; the payments table accepts writes from nowhere else.
 */

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const recorded = await recordPayment(session, "paid");
      if (!recorded) {
        // Storage unavailable — let Stripe retry rather than lose the record.
        return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
      }
      // Booking deposits: a paid deposit confirms the booking.
      if (session.metadata?.kind === "deposit" && session.metadata.bookingId) {
        const admin = createAdminClient();
        if (admin) {
          await admin
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", session.metadata.bookingId);
        }
      }
      break;
    }
    case "checkout.session.async_payment_failed": {
      await recordPayment(event.data.object, "failed");
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const admin = createAdminClient();
      if (admin && typeof charge.payment_intent === "string") {
        await admin
          .from("payments")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent", charge.payment_intent);
      }
      break;
    }
    default:
      // Unhandled event types are acknowledged so Stripe stops retrying.
      break;
  }

  return NextResponse.json({ received: true });
}

async function recordPayment(
  session: Stripe.Checkout.Session,
  status: "paid" | "failed",
): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) {
    log.error("SUPABASE_SERVICE_ROLE_KEY not set — cannot record payment.");
    return false;
  }

  const { error } = await admin.from("payments").upsert(
    {
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status,
      customer_email: session.customer_details?.email ?? null,
      description: session.metadata?.productId ?? session.metadata?.kind ?? null,
      metadata: (session.metadata ?? {}) as Json,
    },
    { onConflict: "stripe_session_id" },
  );

  if (error) {
    log.error("payment upsert failed", { error: error.message });
    return false;
  }
  return true;
}
