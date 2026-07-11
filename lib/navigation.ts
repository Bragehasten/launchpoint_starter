import { clientConfig } from "@/config/client";
import { siteConfig, type NavItem } from "@/config/site";
import { CAPABILITY_PATHS, isCapabilityEnabled } from "@/lib/capabilities";
import type { CapabilityKey } from "@/lib/capabilities/types";

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

export function getMainNav(): NavItem[] {
  const merged: NavItem[] = [];
  const seen = new Set<string>();

  for (const item of [...siteConfig.mainNav, ...(clientConfig.module.nav ?? [])]) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    if (isNavItemVisible(item)) merged.push(item);
  }
  return merged;
}
