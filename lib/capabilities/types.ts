/**
 * Capability layer contracts.
 *
 * A CAPABILITY is a reusable business feature (team, services, booking...).
 * An INDUSTRY MODULE is a declarative bundle that enables and labels
 * capabilities for one industry. A CLIENT CONFIG picks one module and
 * applies per-client overrides. Modules contain configuration only — if a
 * module needs logic, that logic belongs in a capability.
 */

import type { NavItem } from "@/config/site";

/** Every capability the framework knows. Grows as capabilities land. */
export type CapabilityKey =
  | "team"
  | "services"
  | "locations"
  | "promotions"
  | "quotes"
  | "gallery"
  | "booking"
  | "serviceAreas";

type BaseCapabilityConfig = {
  enabled: boolean;
  /** Public label, e.g. "Our Barbers" for team. Drives nav + headings. */
  label?: string;
};

export type CapabilityConfigs = {
  team: BaseCapabilityConfig;
  services: BaseCapabilityConfig & {
    /** "menu" renders food-menu styling; "price-list" renders service styling. */
    presentation?: "menu" | "price-list";
    showPrices?: boolean;
  };
  locations: BaseCapabilityConfig;
  promotions: BaseCapabilityConfig;
  quotes: BaseCapabilityConfig & {
    /** Extra context line above the quote form. */
    intro?: string;
  };
  gallery: BaseCapabilityConfig;
  booking: BaseCapabilityConfig & {
    /**
     * "native": simple Supabase-backed slots (this kit).
     * "external": embed a dedicated scheduler (Calendly, Square...) —
     * the right call for clients with staff calendars and reminders.
     */
    provider?: "native" | "external";
    externalEmbedUrl?: string;
    /** Native provider settings. */
    slotMinutes?: number;
    /** Earliest bookable time, hours from now. */
    leadHours?: number;
    /** How far ahead customers can book, in days. */
    maxAdvanceDays?: number;
    /**
     * Weekly opening template, keyed 0 (Sunday) – 6 (Saturday).
     * Missing/null day = closed. Times are 24h "HH:MM" local.
     */
    weeklyHours?: Partial<
      Record<0 | 1 | 2 | 3 | 4 | 5 | 6, { open: string; close: string } | null>
    >;
    /** Optional deposit collected via Stripe at booking time. */
    deposit?: { type: "percent"; value: number } | { type: "fixed"; value: number };
    /** Total used for percent deposits (cents) until service-linked pricing. */
    depositBaseCents?: number;
  };
  serviceAreas: BaseCapabilityConfig & {
    /**
     * The service noun used in area page titles: "Roofing in Jupiter, FL".
     * Defaults to the module label.
     */
    serviceNoun?: string;
    /** Spanish service noun for /es pages ("Roofing" → "Techado"). */
    serviceNounEs?: string;
    /** Copy above the areas index grid. */
    intro?: string;
  };
};

/** Route each capability owns. Fixed paths keep sitemap/nav predictable. */
export const CAPABILITY_PATHS: Record<CapabilityKey, string> = {
  team: "/team",
  services: "/menu",
  locations: "/locations",
  promotions: "/specials",
  quotes: "/quote",
  gallery: "/gallery",
  booking: "/book",
  serviceAreas: "/service-areas",
};

export type IndustryModule = {
  slug: string;
  label: string;
  /** schema.org LocalBusiness subtype, e.g. "Barbershop", "Restaurant". */
  businessType: string;
  capabilities: Partial<CapabilityConfigs>;
  /** Nav items appended to siteConfig.mainNav (usually capability routes). */
  nav?: NavItem[];
};

export type ClientConfig = {
  module: IndustryModule;
  /** Per-client capability overrides, deep-merged over the module. */
  overrides?: Partial<CapabilityConfigs>;
};

export function defineClient(config: ClientConfig): ClientConfig {
  return config;
}
