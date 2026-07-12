/**
 * Central site configuration.
 *
 * This is the single source of truth for site identity. When cloning the
 * starter for a new client, this file (plus the design tokens in
 * `app/globals.css` and environment variables) is where rebranding happens.
 */

export type NavItem = {
  title: string;
  href: string;
  /** Open in a new tab. */
  external?: boolean;
};

export type SiteConfig = {
  name: string;
  /**
   * Languages this site serves. English is always first-class at the root;
   * adding "es" turns on the /es mirror + language switcher (docs/i18n.md).
   */
  locales?: ("en" | "es")[];
  /** Short description used as the default meta description. */
  description: string;
  /** Absolute production URL, no trailing slash. */
  url: string;
  /** Default Open Graph image path, relative to /public or absolute. */
  ogImage: string;
  locale: string;
  mainNav: NavItem[];
  footerNav: NavItem[];
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  /** Optional call-to-action button rendered in the header. */
  headerCta?: NavItem;
  /**
   * Feature flags. Turn capabilities on/off per client without touching code.
   * Flags will accumulate as milestones land (blog, payments, analytics...).
   */
  features: {
    darkModeToggle: boolean;
    newsletter: boolean;
    cookieBanner: boolean;
  };
};

export const siteConfig: SiteConfig = {
  locales: ["en", "es"],
  name: "cutsbyluis",
  description: "barber in hialeah",
  url: "https://example.com",
  ogImage: "/og.png",
  locale: "en_US",
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Services", href: "/menu" },
    { title: "About", href: "/about" },
    { title: "Gallery", href: "/gallery" },
    { title: "Contact", href: "/contact" },
  ],
  footerNav: [
    { title: "Careers", href: "/careers" },
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Cookies", href: "/cookies" },
  ],
  links: {},
  headerCta: { title: "Book now", href: "/book" },
  features: {
    darkModeToggle: true,
    newsletter: true,
    cookieBanner: true,
  },
};
