import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Barbershop module — the "service business" archetype.
 * Pure configuration: enabling this module lights up team, services,
 * gallery, and promotions with barbershop language. Booking joins in M11.
 */
export const barbershop: IndustryModule = {
  slug: "barbershop",
  label: "Barbershop",
  businessType: "Barbershop",
  defaultRhythm: "grooming-landing",
  capabilities: {
    team: { enabled: true, label: "Our Barbers" },
    services: {
      enabled: true,
      label: "Services",
      presentation: "price-list",
      showPrices: true,
    },
    gallery: { enabled: true, label: "Gallery" },
    promotions: { enabled: true, label: "Specials" },
    locations: { enabled: true, label: "Find Us" },
    booking: {
      enabled: true,
      label: "Book a Chair",
      provider: "native",
      slotMinutes: 30,
      weeklyHours: {
        2: { open: "09:00", close: "18:00" },
        3: { open: "09:00", close: "18:00" },
        4: { open: "09:00", close: "18:00" },
        5: { open: "09:00", close: "19:00" },
        6: { open: "08:00", close: "16:00" },
      },
    },
  },
  nav: [
    { title: "Book", href: "/book" },
    { title: "Services", href: "/menu" },
    { title: "Our Barbers", href: "/team" },
    { title: "Specials", href: "/specials" },
  ],
};
