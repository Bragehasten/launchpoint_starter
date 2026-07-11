/**
 * Payment configuration. Products here are for simple one-off payments
 * (gift cards, flat-fee services). Capabilities (booking deposits, M11)
 * create sessions programmatically with computed amounts instead.
 */

export type Product = {
  id: string;
  name: string;
  description?: string;
  /** Amount in the smallest currency unit (cents). */
  amount: number;
};

export const paymentsConfig = {
  currency: "usd",
  products: [
    {
      id: "gift-card-50",
      name: "Gift card — $50",
      description: "Redeemable for any service.",
      amount: 5_000,
    },
    {
      id: "gift-card-100",
      name: "Gift card — $100",
      description: "Redeemable for any service.",
      amount: 10_000,
    },
  ] satisfies Product[],
} as const;

export function getProduct(id: string): Product | undefined {
  return paymentsConfig.products.find((product) => product.id === id);
}

/**
 * Deposit primitive for booking-heavy industries (tattoo, med spa...).
 * Returns the deposit amount in cents for a given total.
 */
export function depositAmount(
  totalCents: number,
  deposit: { type: "percent"; value: number } | { type: "fixed"; value: number },
): number {
  const amount =
    deposit.type === "percent" ? Math.round((totalCents * deposit.value) / 100) : deposit.value;
  // Stripe minimum charge is $0.50; never exceed the total.
  return Math.min(Math.max(amount, 50), totalCents);
}
