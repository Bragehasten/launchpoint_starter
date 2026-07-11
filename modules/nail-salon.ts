import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Nail Salon module — pure configuration over shared capabilities.
 * Memberships present as promotions until a memberships capability
 * lands (see framework backlog).
 */
export const nailSalon: IndustryModule = {
  slug: "nail-salon",
  label: "Nail Salon",
  businessType: "NailSalon",
  capabilities: {
    services: {
      enabled: true,
      label: "Services & Pricing",
      presentation: "price-list",
      showPrices: true,
    },
    booking: { enabled: true, label: "Book", provider: "native", slotMinutes: 45 },
    promotions: { enabled: true, label: "Memberships & Offers" },
    gallery: { enabled: true, label: "Gallery" },
  },
  nav: [
    { title: "Book", href: "/book" },
    { title: "Services", href: "/menu" },
    { title: "Offers", href: "/specials" },
  ],
};
