import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Plumber module — pure configuration over shared capabilities.
 */
export const plumber: IndustryModule = {
  slug: "plumber",
  label: "Plumber",
  businessType: "Plumber",
  capabilities: {
    quotes: {
      enabled: true,
      label: "Request Service",
      intro: "Describe the problem — emergencies get priority response.",
    },
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: false },
    locations: { enabled: true, label: "Our Location" },
    promotions: { enabled: true, label: "Coupons & Financing" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Plumbing",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Request Service", href: "/quote" },
    { title: "Coupons", href: "/specials" },
  ],
};
