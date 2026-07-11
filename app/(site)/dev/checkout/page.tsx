import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createCheckoutSession } from "@/actions/payments";
import { Container, Section } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentsConfig } from "@/config/payments";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Checkout demo",
  robots: { index: false, follow: false },
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: paymentsConfig.currency,
  }).format(amount / 100);
}

/** Dev-only Stripe test page — exercises the full Checkout loop. */
export default function DevCheckoutPage() {
  if (env.NODE_ENV === "production") notFound();

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div>
          <h1 className="heading text-3xl">Checkout demo</h1>
          <p className="text-muted-foreground mt-2">
            Dev-only. Uses Stripe test mode — pay with card 4242 4242 4242 4242, any future expiry,
            any CVC.
          </p>
        </div>
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          {paymentsConfig.products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description ? (
                  <CardDescription>{product.description}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent>
                <form action={createCheckoutSession}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit">Pay {formatAmount(product.amount)}</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
