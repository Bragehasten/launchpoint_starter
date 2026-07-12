import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Landscaping Company module — pure configuration over shared capabilities.
 */
export const landscaper: IndustryModule = {
  slug: "landscaper",
  label: "Landscaping Company",
  businessType: "HomeAndConstructionBusiness",
  capabilities: {
    gallery: { enabled: true, label: "Project Gallery" },
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: false },
    quotes: {
      enabled: true,
      label: "Get a Quote",
      intro: "Tell us about your yard and what you're dreaming of.",
    },
    promotions: { enabled: true, label: "Seasonal Services" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Landscaping",
      serviceNounEs: "Paisajismo",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Projects", href: "/gallery" },
    { title: "Get a Quote", href: "/quote" },
  ],
};
