"use client";

import * as React from "react";
import { useActionState } from "react";

import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Building blocks for auth forms driven by server actions + useActionState.
 * Field errors come back from Zod validation on the server, so forms work
 * even before JavaScript loads (progressive enhancement).
 */

type AuthFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: (state: ActionState, pending: boolean) => React.ReactNode;
  className?: string;
};

export function AuthForm({ action, children, className }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });

  return (
    <form action={formAction} className={cn("flex flex-col gap-4", className)}>
      {state.status === "error" && state.message ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" && state.message ? (
        <p
          role="status"
          className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
        >
          {state.message}
        </p>
      ) : null}
      {children(state, pending)}
    </form>
  );
}

type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  errors?: string[];
};

export function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  errors,
}: AuthFieldProps) {
  const errorId = `${name}-error`;
  const hasError = Boolean(errors?.length);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
      />
      {hasError ? (
        <p id={errorId} className="text-destructive text-sm">
          {errors![0]}
        </p>
      ) : null}
    </div>
  );
}

export function AuthSubmit({ children, pending }: { children: React.ReactNode; pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Please wait…" : children}
    </Button>
  );
}
