import type { Metadata } from "next";
import { LocalLink as Link } from "@/components/shared/local-link";
import { CircleCheck } from "lucide-react";

import { Container, Section } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Payment successful",
  path: "/checkout/success",
  noIndex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <Section>
      <Container className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CircleCheck className="size-7" aria-hidden="true" />
        </div>
        <h1 className="heading text-3xl">Thank you!</h1>
        <p className="text-muted-foreground">
          Your payment went through. A receipt is on its way to your email.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </Container>
    </Section>
  );
}
