import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "./sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Start in less than a minute</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignUpForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
