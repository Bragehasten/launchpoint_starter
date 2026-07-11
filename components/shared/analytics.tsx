"use client";

import { useEffect, useState } from "react";

import { getConsent, type ConsentState } from "@/lib/consent";

/**
 * Consent-gated web analytics (Vercel Analytics + Speed Insights).
 *
 * Loads the scripts directly from Vercel's first-party endpoints instead of
 * the npm packages — same scripts, zero bundle cost, and they only exist on
 * Vercel deployments (local dev: nothing loads, nothing 404-spams).
 *
 * Vercel Analytics is cookieless, but the framework's privacy posture is
 * that ALL analytics wait for consent — that keeps the cookie policy honest
 * and makes swapping in a client's GA4/Plausible a config change, not a
 * compliance review. Reacts live to the `lp:consent` event from the banner.
 */

const isProduction = process.env.NODE_ENV === "production";

function injectScript(src: string, dataset?: Record<string, string>) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value;
    }
  }
  document.head.appendChild(script);
}

export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(getConsent()?.analytics ?? false);

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<ConsentState>).detail;
      setAllowed(detail.analytics);
    };
    window.addEventListener("lp:consent", onConsent);
    return () => window.removeEventListener("lp:consent", onConsent);
  }, []);

  useEffect(() => {
    if (!allowed || !isProduction) return;
    injectScript("/_vercel/insights/script.js");
    injectScript("/_vercel/speed-insights/script.js");
  }, [allowed]);

  return null;
}
