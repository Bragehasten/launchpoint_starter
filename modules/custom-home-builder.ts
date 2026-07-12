import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Custom Home Builder module — pure configuration over shared capabilities.
 * Communities/floor plans use gallery + services v1; interactive
 * plan explorers are a per-client enhancement.
 */
export const customHomeBuilder: IndustryModule = {
  slug: "custom-home-builder",
  label: "Custom Home Builder",
  businessType: "GeneralContractor",
  capabilities: {
    gallery: { enabled: true, label: "Communities & Homes" },
    services: {
      enabled: true,
      label: "Floor Plans",
      presentation: "price-list",
      showPrices: false,
    },
    quotes: {
      enabled: true,
      label: "Start Your Build",
      intro: "Lot status, target size, and timeline help us guide you.",
    },
    promotions: { enabled: true, label: "Financing & Incentives" },
    team: { enabled: true, label: "Our Team" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Custom Home Building",
      serviceNounEs: "Construcción de Casas a Medida",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Homes", href: "/gallery" },
    { title: "Floor Plans", href: "/menu" },
    { title: "Start Your Build", href: "/quote" },
  ],
};
