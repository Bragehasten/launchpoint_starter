import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Fence Company module — pure configuration over shared capabilities.
 */
export const fenceCompany: IndustryModule = {
  slug: "fence-company",
  label: "Fence Company",
  businessType: "GeneralContractor",
  capabilities: {
    services: {
      enabled: true,
      label: "Fence Types",
      presentation: "price-list",
      showPrices: false,
    },
    gallery: { enabled: true, label: "Material Gallery" },
    quotes: {
      enabled: true,
      label: "Get a Quote",
      intro: "Approximate linear feet and material preference help us quote fast.",
    },
    promotions: { enabled: true, label: "Financing" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Fence Installation",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Fence Types", href: "/menu" },
    { title: "Gallery", href: "/gallery" },
    { title: "Get a Quote", href: "/quote" },
  ],
};
