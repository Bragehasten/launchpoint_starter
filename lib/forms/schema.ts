import { z } from "zod";

import { isFileField, type FormDef, type FormField } from "@/lib/forms/types";

/**
 * Builds the Zod schema for a form definition. Shared verbatim by the
 * client resolver and the server action — one contract, validated twice.
 *
 * All values are strings (submissions travel as FormData so files can ride
 * along). Checkboxes submit "true"/""; files are validated imperatively in
 * the action (size/MIME), not here.
 */

function fieldSchema(field: FormField): z.ZodType<string, unknown> {
  const required = field.required !== false;

  switch (field.type) {
    case "email":
      return z.email({ error: "Enter a valid email address" });
    case "tel": {
      const base = z.string().max(30, "That phone number looks too long");
      return required ? base.min(7, `${field.label} is required`) : base;
    }
    case "date": {
      const base = z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");
      return required ? base.min(1, `${field.label} is required`) : base;
    }
    case "textarea": {
      let schema = z.string().max(field.maxLength ?? 5000, "Please keep it a bit shorter");
      if (required) {
        schema = schema.min(
          field.minLength ?? 10,
          `Tell us a bit more (at least ${field.minLength ?? 10} characters)`,
        );
      }
      return schema;
    }
    case "select": {
      const values = field.options.map((o) => o.value);
      const base = z
        .string()
        .refine((v) => v === "" || values.includes(v), { error: "Pick an option" });
      return required
        ? base.refine((v) => v !== "", { error: `${field.label} is required` })
        : base;
    }
    case "checkbox": {
      // Client (RHF) submits booleans; FormData submits "on"/"true"/absent.
      // Normalize both to "true"/"" so stored data is uniform strings.
      const normalized = z
        .unknown()
        .transform((v) => (v === true || v === "true" || v === "on" ? "true" : ""));
      return required
        ? normalized.refine((v) => v === "true", { error: `${field.label} is required` })
        : normalized;
    }
    case "text": {
      const base = z.string().max(field.maxLength ?? 200, "Please keep it a bit shorter");
      return required ? base.min(1, `${field.label} is required`) : base;
    }
    default:
      // Only "file" reaches here, and file fields never enter the schema.
      return z.string();
  }
}

export function buildFormSchema(def: Pick<FormDef, "fields">) {
  const shape: Record<string, z.ZodType<string, unknown>> = {
    /** Honeypot — hidden from humans; bots fill it and get rejected. */
    company: z.string().max(0, { error: "Invalid submission" }),
  };

  for (const field of def.fields) {
    if (isFileField(field)) continue; // validated in the action
    shape[field.name] = fieldSchema(field);
  }

  return z.object(shape);
}

export type FormValues = Record<string, string>;
