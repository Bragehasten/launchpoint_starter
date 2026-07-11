import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Paver Company module — pure configuration over shared capabilities.
 */
export const paverCompany: IndustryModule = {
  slug: "paver-company",
  label: "Paver Company",
  businessType: "GeneralContractor",
  capabilities: {
    gallery: { enabled: true, label: "Design Inspiration" },
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: false },
    quotes: {
      enabled: true,
      label: "Get a Quote",
      intro: "Patio, driveway, or walkway? Share rough dimensions if you have them.",
    },
    promotions: { enabled: true, label: "Financing" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Paver Installation",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Inspiration", href: "/gallery" },
    { title: "Services", href: "/menu" },
    { title: "Get a Quote", href: "/quote" },
  ],
};
