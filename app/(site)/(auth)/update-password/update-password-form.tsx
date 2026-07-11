"use client";

import { updatePassword } from "@/actions/auth";
import { AuthField, AuthForm, AuthSubmit } from "@/components/shared/auth-form";

export function UpdatePasswordForm() {
  return (
    <AuthForm action={updatePassword}>
      {(state, pending) => (
        <>
          <AuthField
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors?.password}
          />
          <AuthSubmit pending={pending}>Update password</AuthSubmit>
        </>
      )}
    </AuthForm>
  );
}
