import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * HVAC Company module — pure configuration over shared capabilities.
 * Maintenance plans present as service groups; memberships capability
 * (backlog) upgrades them to recurring billing later.
 */
export const hvac: IndustryModule = {
  slug: "hvac",
  label: "HVAC Company",
  businessType: "HVACBusiness",
  capabilities: {
    quotes: {
      enabled: true,
      label: "Request Service",
      intro: "Repair, replacement, or maintenance — tell us what's going on.",
    },
    services: {
      enabled: true,
      label: "Services & Plans",
      presentation: "price-list",
      showPrices: false,
    },
    locations: { enabled: true, label: "Our Location" },
    promotions: { enabled: true, label: "Seasonal Offers & Financing" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "HVAC Service",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Request Service", href: "/quote" },
    { title: "Offers", href: "/specials" },
  ],
};
