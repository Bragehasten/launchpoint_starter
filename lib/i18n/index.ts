import { headers } from "next/headers";

import { en, type Dictionary } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  enabledLocales,
  isMultilingual,
  localizeHref,
  type Locale,
} from "@/lib/i18n/config";
export type { Dictionary } from "@/lib/i18n/dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en, es };

/** Server-side: locale for the current request (set by middleware). */
export async function getLocale(): Promise<Locale> {
  const headerList = await headers();
  const value = headerList.get("x-locale");
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Server-side convenience: dictionary for the current request. */
export async function getDict(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}

/** Fills {placeholders}: interpolate("All {count} locations", { count: 3 }). */
export function interpolate(
  template: string,
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
