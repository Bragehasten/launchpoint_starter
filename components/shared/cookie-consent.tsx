"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Cookie consent banner. Renders only until a choice is made; the choice
 * persists in localStorage (see lib/consent.ts). Feature-flagged via
 * siteConfig.features.cookieBanner.
 */
export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Deferred to the client: consent is per-visitor, never server state.
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  function decide(analytics: boolean) {
    setConsent(analytics);
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t p-4 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm">
          We use essential cookies to make this site work and, with your consent, analytics to
          improve it.{" "}
          <Link href="/cookies" className="underline underline-offset-4">
            Cookie policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => decide(false)}>
            Necessary only
          </Button>
          <Button size="sm" onClick={() => decide(true)}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
