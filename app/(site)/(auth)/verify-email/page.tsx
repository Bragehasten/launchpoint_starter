import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Check your email" };

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="bg-primary/10 text-primary mb-2 flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">Check your email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center text-sm">
          We sent you a confirmation link. Click it to activate your account, then sign in.
        </p>
      </CardContent>
    </Card>
  );
}
