import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Roofing Company module — pure configuration over shared capabilities.
 * Insurance-claim guidance belongs on a composed page (Timeline +
 * FAQ sections); before/after sliders via the BeforeAfter section.
 */
export const roofer: IndustryModule = {
  slug: "roofer",
  label: "Roofing Company",
  businessType: "RoofingContractor",
  capabilities: {
    quotes: {
      enabled: true,
      label: "Free Inspection",
      intro: "Storm damage? Insurance claim? Start here.",
    },
    services: {
      enabled: true,
      label: "Roofing Services",
      presentation: "price-list",
      showPrices: false,
    },
    gallery: { enabled: true, label: "Project Gallery" },
    promotions: { enabled: true, label: "Financing" },
    locations: { enabled: true, label: "Our Location" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "Roofing",
      serviceNounEs: "Techado",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Projects", href: "/gallery" },
    { title: "Free Inspection", href: "/quote" },
  ],
};
