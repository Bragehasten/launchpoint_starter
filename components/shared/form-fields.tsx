"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * React Hook Form field components with labels, error display, and a11y
 * wiring built in. Every form in the framework (contact, newsletter, quote
 * requests in M10...) composes these inside a FormProvider.
 */

type BaseFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
};

function useFieldState(name: string) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;
  const errorId = `${name}-error`;
  return {
    register,
    error: typeof error === "string" ? error : undefined,
    errorId,
  };
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-destructive text-sm">
      {error}
    </p>
  );
}

export function TextField<T extends FieldValues>({
  name,
  label,
  placeholder,
  autoComplete,
  type = "text",
}: BaseFieldProps<T> & { type?: string }) {
  const { register, error, errorId } = useFieldState(name);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 5,
}: BaseFieldProps<T> & { rows?: number }) {
  const { register, error, errorId } = useFieldState(name);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(name)}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
}: BaseFieldProps<T> & { options: readonly { value: string; label: string }[] }) {
  const { register, error, errorId } = useFieldState(name);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="border-input bg-background focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
        {...register(name)}
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function CheckboxField<T extends FieldValues>({ name, label }: BaseFieldProps<T>) {
  const { register, error, errorId } = useFieldState(name);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-center gap-2 text-sm">
        <input
          id={name}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="accent-primary size-4"
          {...register(name)}
        />
        {label}
      </label>
      <FieldError id={errorId} error={error} />
    </div>
  );
}

/**
 * File input: intentionally NOT registered with react-hook-form. The value
 * rides the native FormData on submit; the server action validates size and
 * MIME and uploads to private storage.
 */
export function FileField({
  name,
  label,
  accept,
}: {
  name: string;
  label: string;
  accept?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="file"
        accept={accept}
        className="file:text-foreground pt-1.5 file:mr-3 file:text-sm file:font-medium"
      />
    </div>
  );
}

/**
 * Honeypot: invisible to humans (visually hidden + tabIndex -1 +
 * autocomplete off), tempting to bots. Schema rejects non-empty values.
 */
export function HoneypotField({ name = "company" }: { name?: string }) {
  const { register } = useFormContext();
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Company
        <input type="text" tabIndex={-1} autoComplete="off" {...register(name)} />
      </label>
    </div>
  );
}
