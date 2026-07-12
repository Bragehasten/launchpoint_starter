"use client";

import Link from "next/link";
import * as React from "react";

import { useLocalizedHref } from "@/components/shared/locale-provider";

/**
 * Drop-in for next/link that keeps visitors in their language: internal
 * hrefs get the /es prefix when the current locale is Spanish. External
 * URLs, /admin, /api, and /account pass through untouched.
 *
 * Public-facing components use THIS instead of next/link; admin keeps
 * plain Link (the dashboard is English-only by design).
 */
export const LocalLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<typeof Link>>(
  function LocalLink({ href, ...props }, ref) {
    const localize = useLocalizedHref();
    const localizedHref = typeof href === "string" ? localize(href) : href;
    return <Link ref={ref} href={localizedHref} {...props} />;
  },
);
