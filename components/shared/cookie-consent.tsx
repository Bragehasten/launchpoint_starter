"use client";

import * as React from "react";
import { LocalLink as Link } from "@/components/shared/local-link";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/shared/locale-provider";
import { getConsent, setConsent } from "@/lib/consent";

/**
 * Cookie consent banner. Renders only until a choice is made; the choice
 * persists in localStorage (see lib/consent.ts). Feature-flagged via
 * siteConfig.features.cookieBanner.
 */
const COPY = {
  en: {
    body: "We use essential cookies to make this site work and, with your consent, analytics to improve it.",
    policy: "Cookie policy",
    necessary: "Necessary only",
    acceptAll: "Accept all",
  },
  es: {
    body: "Usamos cookies esenciales para que este sitio funcione y, con tu consentimiento, cookies de análisis para mejorarlo.",
    policy: "Política de cookies",
    necessary: "Solo las necesarias",
    acceptAll: "Aceptar todas",
  },
} as const;

export function CookieConsent() {
  const locale = useLocale();
  const copy = COPY[locale];
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
          {copy.body}{" "}
          <Link href="/cookies" className="underline underline-offset-4">
            {copy.policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => decide(false)}>
            {copy.necessary}
          </Button>
          <Button size="sm" onClick={() => decide(true)}>
            {copy.acceptAll}
          </Button>
        </div>
      </div>
    </div>
  );
}
