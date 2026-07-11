import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Coffee Shop module — pure configuration over shared capabilities.
 * Loyalty programs ride on promotions until a loyalty capability lands
 * (see framework backlog).
 */
export const coffeeShop: IndustryModule = {
  slug: "coffee-shop",
  label: "Coffee Shop",
  businessType: "CafeOrCoffeeShop",
  capabilities: {
    services: { enabled: true, label: "Menu", presentation: "menu", showPrices: true },
    locations: { enabled: true, label: "Locations" },
    promotions: { enabled: true, label: "Seasonal Specials" },
    gallery: { enabled: true, label: "Gallery" },
  },
  nav: [
    { title: "Menu", href: "/menu" },
    { title: "Locations", href: "/locations" },
    { title: "Seasonal", href: "/specials" },
  ],
};
