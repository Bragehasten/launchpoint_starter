import { siteConfig } from "@/config/site";

/**
 * Locale plumbing. English is the default and lives at the root; Spanish
 * (when a client opts in via siteConfig.locales) lives under /es with the
 * same paths: /menu → /es/menu.
 *
 * Locale travels as the `x-locale` request header, set by middleware from
 * the URL prefix — possible without route restructuring because the app
 * renders per-request (forced dynamic since the CSP milestone).
 */

export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "es"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Locales this client actually serves (opt-in beyond English). */
export function enabledLocales(): Locale[] {
  const configured = siteConfig.locales ?? [DEFAULT_LOCALE];
  return SUPPORTED_LOCALES.filter((locale) => configured.includes(locale));
}

export function isMultilingual(): boolean {
  return enabledLocales().length > 1;
}

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Prefixes an internal href for a locale: localizeHref("/menu", "es") → "/es/menu". */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (!href.startsWith("/") || href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  if (href.startsWith("/admin") || href.startsWith("/api") || href.startsWith("/account")) {
    return href;
  }
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}
