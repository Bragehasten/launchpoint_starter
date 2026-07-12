import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Electrician module — pure configuration over shared capabilities.
 * Emergency service: point siteConfig.headerCta at /quote (or tel:)
 * so it's one tap from every page.
 */
export const electrician: IndustryModule = {
  slug: "electrician",
  label: "Electrician",
  businessType: "Electrician",
  capabilities: {
    quotes: {
      enabled: true,
      label: "Get a Quote",
      intro: "Describe the job — emergencies get priority response.",
    },
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: false },
    locations: { enabled: true, label: "Our Location" },
    promotions: { enabled: true, label: "Financing & Offers" },
    gallery: { enabled: true, label: "Our Work" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Electrical Service",
      serviceNounEs: "Servicio Eléctrico",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Get a Quote", href: "/quote" },
    { title: "Service Areas", href: "/locations" },
    { title: "Financing", href: "/specials" },
  ],
};
