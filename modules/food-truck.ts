import type { IndustryModule } from "@/lib/capabilities/types";

/**
 * Food Truck module — pure configuration over shared capabilities.
 * Daily location tracker = the locations capability with frequent edits
 * (or a pinned promotion). A live schedule capability is on the backlog.
 */
export const foodTruck: IndustryModule = {
  slug: "food-truck",
  label: "Food Truck",
  businessType: "FoodEstablishment",
  capabilities: {
    services: { enabled: true, label: "Menu", presentation: "menu", showPrices: true },
    locations: { enabled: true, label: "Find the Truck" },
    promotions: { enabled: true, label: "Events" },
    quotes: {
      enabled: true,
      label: "Catering",
      intro: "Tell us about your event — headcount, date, location.",
    },
    gallery: { enabled: true, label: "Gallery" },
  },
  nav: [
    { title: "Menu", href: "/menu" },
    { title: "Find the Truck", href: "/locations" },
    { title: "Events", href: "/specials" },
    { title: "Catering", href: "/quote" },
  ],
};
