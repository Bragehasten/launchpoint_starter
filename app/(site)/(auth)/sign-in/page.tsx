import type { Metadata } from "next";
import { LocalLink as Link } from "@/components/shared/local-link";

import { SignInForm } from "./sign-in-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignInForm next={next} />
        <p className="text-muted-foreground text-center text-sm">
          No account?{" "}
          <Link href="/sign-up" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
