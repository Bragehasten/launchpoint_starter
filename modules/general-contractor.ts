import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * General Contractor module — pure configuration over shared capabilities.
 * Process timeline: compose a page with the Timeline section.
 */
export const generalContractor: IndustryModule = {
  slug: "general-contractor",
  label: "General Contractor",
  businessType: "GeneralContractor",
  capabilities: {
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: false },
    gallery: { enabled: true, label: "Portfolio" },
    quotes: {
      enabled: true,
      label: "Project Inquiry",
      intro: "Tell us about the project — scope, timing, budget range.",
    },
    team: { enabled: true, label: "Our Team" },
    serviceAreas: {
      enabled: true,
      label: "Service Areas",
      serviceNoun: "General Contracting",
    },
  },
  nav: [
    { title: "Service Areas", href: "/service-areas" },
    { title: "Services", href: "/menu" },
    { title: "Portfolio", href: "/gallery" },
    { title: "Start a Project", href: "/quote" },
  ],
};
