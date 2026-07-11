import type { Metadata } from "next";

import { UpdatePasswordForm } from "./update-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Update password" };

export default async function UpdatePasswordPage() {
  // Only reachable with a valid recovery session (from the email link).
  await requireUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Choose a new password</CardTitle>
        <CardDescription>You&apos;ll stay signed in after updating</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
