import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Checkout cancelled",
  path: "/checkout/cancelled",
  noIndex: true,
});

export default function CheckoutCancelledPage() {
  return (
    <Section>
      <Container className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="heading text-3xl">Checkout cancelled</h1>
        <p className="text-muted-foreground">
          No charge was made. If something went wrong, we&apos;re happy to help.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
