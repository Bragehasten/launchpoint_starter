import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Hair Salon module — pure configuration over shared capabilities.
 * Before/after work uses the gallery capability plus the BeforeAfter
 * section on composed pages.
 */
export const hairSalon: IndustryModule = {
  slug: "hair-salon",
  label: "Hair Salon",
  businessType: "HairSalon",
  capabilities: {
    team: { enabled: true, label: "Our Stylists" },
    services: { enabled: true, label: "Services", presentation: "price-list", showPrices: true },
    booking: { enabled: true, label: "Book an Appointment", provider: "native", slotMinutes: 45 },
    gallery: { enabled: true, label: "Before & After" },
    promotions: { enabled: true, label: "Offers" },
  },
  nav: [
    { title: "Book", href: "/book" },
    { title: "Services", href: "/menu" },
    { title: "Stylists", href: "/team" },
    { title: "Gallery", href: "/gallery" },
  ],
};
