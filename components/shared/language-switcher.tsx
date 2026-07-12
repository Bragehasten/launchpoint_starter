"use client";

import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * EN ⇄ ES toggle. Reads the current locale from the URL prefix (not from
 * context, which is stale after a client navigation) and does a full-page
 * navigation so middleware re-runs and the server renders the new language.
 */
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() ?? "/";
  const isEs = pathname === "/es" || pathname.startsWith("/es/");

  const target = isEs
    ? pathname.replace(/^\/es(?=\/|$)/, "") || "/"
    : pathname === "/"
      ? "/es"
      : `/es${pathname}`;

  return (
    <Button asChild variant="ghost" size="sm" className="gap-1.5">
      {/* Plain <a> on purpose: a full reload re-runs the /es middleware
          rewrite so the server renders the switched locale. */}
      <a href={target} rel="alternate" hrefLang={isEs ? "en" : "es"}>
        <Languages className="size-4" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
