"use client";

import * as React from "react";

import { DEFAULT_LOCALE, localizeHref, type Locale } from "@/lib/i18n/config";

/**
 * Client-side locale context. The root layout provides the request's locale
 * (derived from the /es URL prefix by middleware); client components read
 * it for link prefixing and the language switcher. Dictionary strings are
 * resolved on the SERVER and passed down as props — this context carries
 * only the locale tag.
 */

const LocaleContext = React.createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return React.useContext(LocaleContext);
}

/** Locale-aware href helper for client components. */
export function useLocalizedHref(): (href: string) => string {
  const locale = useLocale();
  return React.useCallback((href: string) => localizeHref(href, locale), [locale]);
}
