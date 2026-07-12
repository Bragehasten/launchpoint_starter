/**
 * Forms engine — type layer.
 *
 * A form is DATA: an ordered list of field definitions plus routing
 * behavior. From one definition the engine derives the Zod schema
 * (lib/forms/schema.ts), the rendered form (components/forms/dynamic-form),
 * and the server handling (actions/form-engine) — so adding a form for a
 * client is writing config, never components or actions.
 *
 * Conventions:
 * - Every form MUST include a field named "email" (type "email") — it drives
 *   reply-to and the autoresponder.
 * - File fields upload to the private `form-attachments` bucket; the
 *   submission stores the storage path, and admins get signed URLs.
 */

type BaseField = {
  name: string;
  label: string;
  placeholder?: string;
  /** Defaults to true. Optional fields accept empty values. */
  required?: boolean;
  autoComplete?: string;
  /** Render beside the previous field on wide screens. */
  half?: boolean;
};

export type FormField = BaseField &
  (
    | { type: "text" | "email" | "tel" | "date"; maxLength?: number }
    | { type: "textarea"; rows?: number; minLength?: number; maxLength?: number }
    | { type: "select"; options: readonly { value: string; label: string }[] }
    | { type: "checkbox" }
    | { type: "file"; accept?: string }
  );

export type FormDef = {
  /** URL + submission `kind`: /forms/<slug>, inbox filter value. */
  slug: string;
  title: string;
  /** Short copy above the form. */
  intro?: string;
  fields: readonly FormField[];
  submitLabel?: string;
  successMessage: string;
  /** Notification subject; receives the validated string values. */
  subject?: (values: Record<string, string>) => string;
  /**
   * Emergency forms take the loud path: URGENT-prefixed subject and the
   * SMS seam in the engine action. For after-hours trades work.
   */
  emergency?: boolean;
  /** Confirmation email sent to the submitter (requires Resend). */
  autoresponder?: { subject: string; body: string };
  /**
   * Spanish strings (i18n, docs/i18n.md). Anything omitted falls back to
   * English. The OWNER notification always uses the English definition —
   * only visitor-facing strings localize.
   */
  es?: {
    title?: string;
    intro?: string;
    submitLabel?: string;
    successMessage?: string;
    autoresponder?: { subject: string; body: string };
    fields?: Record<string, { label?: string; placeholder?: string }>;
  };
};

/**
 * The serializable subset of a FormDef that a Client Component may receive.
 * A FormDef's `subject`/`autoresponder` behavior is server-only — functions
 * cannot be passed as Client Component props.
 */
export type FormClientDef = Pick<FormDef, "slug" | "fields" | "submitLabel">;

/** Strip server-only fields so a form def can cross the Server→Client boundary. */
export function toClientDef(def: FormDef): FormClientDef {
  return { slug: def.slug, fields: def.fields, submitLabel: def.submitLabel };
}

/**
 * Resolves a definition for a locale: Spanish strings overlay English,
 * field-by-field, with full fallback. Returns the def unchanged for "en".
 */
export function resolveFormDef(def: FormDef, locale: string): FormDef {
  if (locale !== "es" || !def.es) return def;
  const overlay = def.es;
  return {
    ...def,
    title: overlay.title ?? def.title,
    intro: overlay.intro ?? def.intro,
    submitLabel: overlay.submitLabel ?? def.submitLabel,
    successMessage: overlay.successMessage ?? def.successMessage,
    autoresponder: overlay.autoresponder ?? def.autoresponder,
    fields: def.fields.map((field) => {
      const patch = overlay.fields?.[field.name];
      if (!patch) return field;
      return {
        ...field,
        label: patch.label ?? field.label,
        ...("placeholder" in field ? { placeholder: patch.placeholder ?? field.placeholder } : {}),
      };
    }),
  };
}

/** Narrowing helpers used by the renderer and the engine action. */
export function isFileField(field: FormField): field is FormField & { type: "file" } {
  return field.type === "file";
}
