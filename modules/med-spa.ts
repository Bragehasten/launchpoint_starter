import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Med Spa module — pure configuration over shared capabilities.
 */
export const medSpa: IndustryModule = {
  slug: "med-spa",
  label: "Med Spa",
  businessType: "HealthAndBeautyBusiness",
  capabilities: {
    services: { enabled: true, label: "Treatments", presentation: "price-list", showPrices: true },
    team: { enabled: true, label: "Our Providers" },
    booking: {
      enabled: true,
      label: "Book a Consultation",
      provider: "native",
      slotMinutes: 30,
      deposit: { type: "percent", value: 20 },
      depositBaseCents: 15_000,
    },
    promotions: { enabled: true, label: "Memberships & Specials" },
    gallery: { enabled: true, label: "Before & After" },
  },
  nav: [
    { title: "Treatments", href: "/menu" },
    { title: "Providers", href: "/team" },
    { title: "Book", href: "/book" },
  ],
};
