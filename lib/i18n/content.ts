import "server-only";

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Content localization: overlays field-level translations (migration 0010)
 * onto rows fetched by the capability queries. English is the base data;
 * missing translations fall back field-by-field, so a half-translated site
 * shows mixed content instead of holes.
 *
 * Which fields are translatable per entity lives HERE, in one map — the
 * admin translate flow and the AI batch translator both read it.
 */

export const TRANSLATABLE_FIELDS: Record<string, readonly string[]> = {
  services: ["name", "description"],
  service_groups: ["name", "description"],
  promotions: ["title", "body", "badge"],
  team_members: ["role", "bio"],
  locations: ["intro"],
  service_areas: ["intro", "body", "faqs"],
};

type Row = { id: string } & Record<string, unknown>;

/**
 * Overlays `locale` translations onto `records`. JSON-typed base fields
 * (e.g. service_areas.faqs) round-trip through JSON.parse.
 */
export async function localizeRecords<T extends Row>(
  entity: keyof typeof TRANSLATABLE_FIELDS & string,
  records: T[],
  locale: Locale,
): Promise<T[]> {
  if (locale === DEFAULT_LOCALE || records.length === 0) return records;

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("translations")
    .select("entity_id, field, value")
    .eq("entity", entity)
    .eq("locale", locale)
    .in(
      "entity_id",
      records.map((r) => r.id),
    );
  if (!rows || rows.length === 0) return records;

  const byRecord = new Map<string, Map<string, string>>();
  for (const row of rows) {
    const fields = byRecord.get(row.entity_id) ?? new Map<string, string>();
    fields.set(row.field, row.value);
    byRecord.set(row.entity_id, fields);
  }

  return records.map((record) => {
    const fields = byRecord.get(record.id);
    if (!fields) return record;
    const patched: Record<string, unknown> = { ...record };
    for (const [field, value] of fields) {
      if (!(field in record)) continue;
      const base = record[field];
      if (base !== null && typeof base === "object") {
        // JSON field (faqs): the translation stores serialized JSON.
        try {
          patched[field] = JSON.parse(value);
        } catch {
          // Malformed translation — keep the English base.
        }
      } else {
        patched[field] = value;
      }
    }
    return patched as T;
  });
}

export async function localizeRecord<T extends Row>(
  entity: keyof typeof TRANSLATABLE_FIELDS & string,
  record: T | null,
  locale: Locale,
): Promise<T | null> {
  if (!record) return null;
  const [localized] = await localizeRecords(entity, [record], locale);
  return localized ?? record;
}
