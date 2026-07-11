"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitEngineForm } from "@/actions/form-engine";
import {
  CheckboxField,
  FileField,
  HoneypotField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";
import { buildFormSchema } from "@/lib/forms/schema";
import { isFileField, type FormClientDef, type FormField } from "@/lib/forms/types";

/**
 * Renders any FormDef. Validation runs client-side from the same schema the
 * server enforces; submission travels as native FormData (from the real
 * <form> element) so file inputs ride along without any special handling.
 */

function renderField(field: FormField) {
  switch (field.type) {
    case "textarea":
      return (
        <TextareaField
          key={field.name}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          rows={field.rows ?? 5}
        />
      );
    case "select":
      return (
        <SelectField
          key={field.name}
          name={field.name}
          label={field.label}
          options={field.options}
        />
      );
    case "checkbox":
      return <CheckboxField key={field.name} name={field.name} label={field.label} />;
    case "file":
      return (
        <FileField key={field.name} name={field.name} label={field.label} accept={field.accept} />
      );
    default:
      return (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
        />
      );
  }
}

/** Pack consecutive `half` fields into two-column rows. */
function groupFields(fields: readonly FormField[]): FormField[][] {
  const rows: FormField[][] = [];
  for (const field of fields) {
    const last = rows[rows.length - 1];
    if (field.half && last && last.length === 1 && last[0]?.half) {
      last.push(field);
    } else {
      rows.push([field]);
    }
  }
  return rows;
}

export function DynamicForm({ def }: { def: FormClientDef }) {
  const [pending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  const defaultValues: Record<string, unknown> = { company: "" };
  for (const field of def.fields) {
    if (isFileField(field)) continue;
    defaultValues[field.name] = field.type === "checkbox" ? false : "";
  }

  const form = useForm({
    resolver: zodResolver(buildFormSchema(def)),
    defaultValues,
  });

  function onValid() {
    const element = formRef.current;
    if (!element) return;
    startTransition(async () => {
      const formData = new FormData(element);
      formData.set("_form", def.slug);
      const result = await submitEngineForm(formData);
      if (result.success) {
        toast.success(result.message ?? "Sent!");
        form.reset();
        element.reset(); // clears uncontrolled file inputs
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onValid)}
        className="relative flex flex-col gap-4"
        noValidate
      >
        <HoneypotField />
        {groupFields(def.fields).map((row) =>
          row.length === 2 ? (
            <div key={row[0]?.name} className="grid gap-4 sm:grid-cols-2">
              {row.map(renderField)}
            </div>
          ) : (
            renderField(row[0] as FormField)
          ),
        )}
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? <Loader2 className="animate-spin" /> : null}
          {def.submitLabel ?? "Submit"}
        </Button>
      </form>
    </FormProvider>
  );
}
