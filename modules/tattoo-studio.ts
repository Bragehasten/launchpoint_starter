import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Tattoo Studio module — pure configuration over shared capabilities.
 * Deposits are non-negotiable in this industry: booking collects a
 * fixed $50 via Stripe; the webhook confirms on payment.
 */
export const tattooStudio: IndustryModule = {
  slug: "tattoo-studio",
  label: "Tattoo Studio",
  businessType: "TattooParlor",
  capabilities: {
    team: { enabled: true, label: "Our Artists" },
    gallery: { enabled: true, label: "Portfolio" },
    booking: {
      enabled: true,
      label: "Book a Consult",
      provider: "native",
      slotMinutes: 60,
      deposit: { type: "fixed", value: 5_000 },
      depositBaseCents: 5_000,
    },
    promotions: { enabled: true, label: "Flash & Events" },
  },
  nav: [
    { title: "Artists", href: "/team" },
    { title: "Portfolio", href: "/gallery" },
    { title: "Book", href: "/book" },
    { title: "Flash", href: "/specials" },
  ],
};
