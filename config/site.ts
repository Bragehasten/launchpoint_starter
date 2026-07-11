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
  name: "LaunchPoint",
  description: "A production-grade website foundation: fast, accessible, and ready to ship.",
  url: "https://example.com",
  ogImage: "/og.png",
  locale: "en_US",
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "About", href: "/about" },
    { title: "Gallery", href: "/gallery" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
  footerNav: [
    { title: "Careers", href: "/careers" },
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Cookies", href: "/cookies" },
  ],
  links: {},
  headerCta: { title: "Get started", href: "/contact" },
  features: {
    darkModeToggle: true,
    newsletter: true,
    cookieBanner: true,
  },
};
