import { clientConfig } from "@/config/client";
import {
  CAPABILITY_PATHS,
  type CapabilityConfigs,
  type CapabilityKey,
} from "@/lib/capabilities/types";

/**
 * Capability resolution: module defaults merged with client overrides.
 * Pages call getCapability() and notFound() when disabled; nav and sitemap
 * call enabledCapabilities() so disabled features vanish everywhere at once.
 */

const DISABLED = { enabled: false } as const;

export function getCapability<K extends CapabilityKey>(key: K): CapabilityConfigs[K] {
  const fromModule = clientConfig.module.capabilities[key];
  const fromOverrides = clientConfig.overrides?.[key];
  if (!fromModule && !fromOverrides) return DISABLED as CapabilityConfigs[K];
  return { ...fromModule, ...fromOverrides } as CapabilityConfigs[K];
}

export function isCapabilityEnabled(key: CapabilityKey): boolean {
  return getCapability(key).enabled === true;
}

export function capabilityPath(key: CapabilityKey): string {
  return CAPABILITY_PATHS[key];
}

export function enabledCapabilities(): CapabilityKey[] {
  return (Object.keys(CAPABILITY_PATHS) as CapabilityKey[]).filter(isCapabilityEnabled);
}

export { CAPABILITY_PATHS } from "@/lib/capabilities/types";
