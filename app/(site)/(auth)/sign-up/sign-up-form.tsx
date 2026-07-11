"use client";

import { signUp } from "@/actions/auth";
import { AuthField, AuthForm, AuthSubmit } from "@/components/shared/auth-form";

export function SignUpForm() {
  return (
    <AuthForm action={signUp}>
      {(state, pending) => (
        <>
          <AuthField
            label="Full name"
            name="fullName"
            autoComplete="name"
            errors={state.fieldErrors?.fullName}
          />
          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            errors={state.fieldErrors?.email}
          />
          <AuthField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            errors={state.fieldErrors?.password}
          />
          <AuthSubmit pending={pending}>Create account</AuthSubmit>
        </>
      )}
    </AuthForm>
  );
}
