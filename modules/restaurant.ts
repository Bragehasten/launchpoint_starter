import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Restaurant module — the "hospitality" archetype.
 * Menu presentation, locations with hours, events/catering ride on
 * promotions until a dedicated capability earns its keep.
 */
export const restaurant: IndustryModule = {
  slug: "restaurant",
  label: "Restaurant",
  businessType: "Restaurant",
  capabilities: {
    services: { enabled: true, label: "Menu", presentation: "menu", showPrices: true },
    locations: { enabled: true, label: "Locations & Hours" },
    gallery: { enabled: true, label: "Gallery" },
    promotions: { enabled: true, label: "Events & Specials" },
    quotes: { enabled: true, label: "Catering", intro: "Tell us about your event." },
  },
  nav: [
    { title: "Menu", href: "/menu" },
    { title: "Locations", href: "/locations" },
    { title: "Events", href: "/specials" },
  ],
};
