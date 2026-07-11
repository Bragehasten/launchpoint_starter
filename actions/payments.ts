"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getProduct, paymentsConfig } from "@/config/payments";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";

/**
 * Stripe Checkout server actions.
 * Amounts always come from server-side config or computation — never from
 * the client — so prices cannot be tampered with.
 */

export type CheckoutResult = { success: false; message: string };

const checkoutSchema = z.object({ productId: z.string().min(1) });

/** Form action: failures redirect to the cancelled page (actions in <form> must return void). */
export async function createCheckoutSession(formData: FormData): Promise<void> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await rateLimit(`checkout:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!success) redirect("/checkout/cancelled?reason=rate-limit");

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/checkout/cancelled?reason=invalid");

  const product = getProduct(parsed.data.productId);
  if (!product) redirect("/checkout/cancelled?reason=unknown-product");

  const stripe = getStripe();
  if (!stripe) redirect("/checkout/cancelled?reason=not-configured");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: paymentsConfig.currency,
          unit_amount: product.amount,
          product_data: {
            name: product.name,
            ...(product.description ? { description: product.description } : {}),
          },
        },
      },
    ],
    metadata: { productId: product.id },
    success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/cancelled`,
  });

  if (!session.url) redirect("/checkout/cancelled?reason=session-failed");
  redirect(session.url);
}

/**
 * Deposit checkout for capabilities (booking, M11): the caller computes
 * the deposit server-side via config/payments depositAmount() and passes
 * context in metadata for reconciliation.
 */
export async function createDepositSession(options: {
  amountCents: number;
  description: string;
  metadata?: Record<string, string>;
}): Promise<{ url: string } | CheckoutResult> {
  const stripe = getStripe();
  if (!stripe) return { success: false, message: "Payments are not configured yet." };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: paymentsConfig.currency,
          unit_amount: options.amountCents,
          product_data: { name: options.description },
        },
      },
    ],
    metadata: { kind: "deposit", ...options.metadata },
    success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/cancelled`,
  });

  if (!session.url) return { success: false, message: "Could not start checkout." };
  return { url: session.url };
}
