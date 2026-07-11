"use client";

import { requestPasswordReset } from "@/actions/auth";
import { AuthField, AuthForm, AuthSubmit } from "@/components/shared/auth-form";

export function ResetPasswordForm() {
  return (
    <AuthForm action={requestPasswordReset}>
      {(state, pending) => (
        <>
          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            errors={state.fieldErrors?.email}
          />
          <AuthSubmit pending={pending}>Send reset link</AuthSubmit>
        </>
      )}
    </AuthForm>
  );
}
