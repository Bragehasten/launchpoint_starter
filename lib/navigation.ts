import { clientConfig } from "@/config/client";
import { siteConfig, type NavItem } from "@/config/site";
import { CAPABILITY_PATHS, isCapabilityEnabled } from "@/lib/capabilities";
import type { CapabilityKey } from "@/lib/capabilities/types";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { translateNavTitle } from "@/lib/i18n/nav";

/**
 * Main navigation = site config nav + module nav, deduped by href, with
 * items pointing at disabled capabilities filtered out automatically.
 */

const PATH_TO_CAPABILITY = Object.fromEntries(
  Object.entries(CAPABILITY_PATHS).map(([key, path]) => [path, key as CapabilityKey]),
) as Record<string, CapabilityKey>;

function isNavItemVisible(item: NavItem): boolean {
  const capability = PATH_TO_CAPABILITY[item.href];
  return capability ? isCapabilityEnabled(capability) : true;
}

export function getMainNav(locale: Locale = DEFAULT_LOCALE): NavItem[] {
  const merged: NavItem[] = [];
  const seen = new Set<string>();

  const ctaHref = siteConfig.headerCta?.href;

  for (const item of [...siteConfig.mainNav, ...(clientConfig.module.nav ?? [])]) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    // The CTA (e.g. "Book now") renders as its own button — never duplicate it as a nav link.
    if (item.href === ctaHref) continue;
    if (isNavItemVisible(item)) {
      merged.push({ ...item, title: translateNavTitle(item.title, locale) });
    }
  }
  return merged;
}
