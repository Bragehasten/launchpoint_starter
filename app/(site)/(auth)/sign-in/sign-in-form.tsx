"use client";

import { LocalLink as Link } from "@/components/shared/local-link";

import { signIn, signInWithMagicLink } from "@/actions/auth";
import { AuthField, AuthForm, AuthSubmit } from "@/components/shared/auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SignInForm({ next }: { next?: string }) {
  return (
    <Tabs defaultValue="password">
      <TabsList className="w-full">
        <TabsTrigger value="password" className="flex-1">
          Password
        </TabsTrigger>
        <TabsTrigger value="magic-link" className="flex-1">
          Magic link
        </TabsTrigger>
      </TabsList>

      <TabsContent value="password">
        <AuthForm action={signIn}>
          {(state, pending) => (
            <>
              {next ? <input type="hidden" name="next" value={next} /> : null}
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
                autoComplete="current-password"
                errors={state.fieldErrors?.password}
              />
              <div className="text-right">
                <Link
                  href="/reset-password"
                  className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <AuthSubmit pending={pending}>Sign in</AuthSubmit>
            </>
          )}
        </AuthForm>
      </TabsContent>

      <TabsContent value="magic-link">
        <AuthForm action={signInWithMagicLink}>
          {(state, pending) => (
            <>
              <AuthField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                errors={state.fieldErrors?.email}
              />
              <AuthSubmit pending={pending}>Email me a sign-in link</AuthSubmit>
            </>
          )}
        </AuthForm>
      </TabsContent>
    </Tabs>
  );
}
