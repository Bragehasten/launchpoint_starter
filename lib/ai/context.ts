import "server-only";

import { activeTheme } from "@/config/theme";
import { clientConfig } from "@/config/client";
import { siteConfig } from "@/config/site";
import { getCapability, isCapabilityEnabled } from "@/lib/capabilities";
import { getLocations, getServiceAreas, getServiceGroups } from "@/lib/capabilities/queries";

/**
 * Business context injected into every AI prompt, assembled from config and
 * the client's actual content. This is what makes output specific to THIS
 * business instead of generic marketing sludge.
 */
export async function buildBusinessContext(): Promise<string> {
  const industryModule = clientConfig.module;
  const lines: string[] = [
    `Business: ${siteConfig.name}`,
    `Industry: ${industryModule.label} (schema.org ${industryModule.businessType})`,
    `Positioning: ${siteConfig.description}`,
  ];

  if (isCapabilityEnabled("services")) {
    const groups = await getServiceGroups();
    const services = groups.flatMap((g) => g.services.map((s) => s.name));
    if (services.length > 0) lines.push(`Services: ${services.join(", ")}`);
  }

  if (isCapabilityEnabled("locations")) {
    const locations = await getLocations();
    if (locations.length > 0) {
      lines.push(
        `Locations: ${locations
          .map((l) => `${l.name} (${[l.city, l.region].filter(Boolean).join(", ") || l.address})`)
          .join("; ")}`,
      );
    }
  }

  if (isCapabilityEnabled("serviceAreas")) {
    const areas = await getServiceAreas();
    const capability = getCapability("serviceAreas");
    if (capability.enabled && capability.serviceNoun) {
      lines.push(`Service noun: ${capability.serviceNoun}`);
    }
    if (areas.length > 0) {
      lines.push(`Existing service areas: ${areas.map((a) => a.name).join(", ")}`);
    }
  }

  return lines.join("\n");
}

export const BRAND_VOICE_RULES = `Voice rules:
- Write like the owner talking to a neighbor: concrete, confident, zero corporate filler.
- Banned: "look no further", "we've got you covered", "your one-stop shop", "nestled", exclamation marks.
- Specifics beat superlatives. Never invent facts, awards, years in business, or statistics — if a detail isn't provided, don't claim it.
- American English, sentence case headings.
- Match the brand's tone: ${activeTheme.personality.voice.join(", ")}.`;
