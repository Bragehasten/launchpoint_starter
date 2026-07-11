import type { Metadata } from "next";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Authentication error" };

export default function AuthErrorPage() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="bg-destructive/10 text-destructive mb-2 flex size-12 items-center justify-center rounded-full">
          <TriangleAlert className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">Link expired or invalid</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center text-sm">
          The sign-in link may have expired or already been used. Request a new one and try again.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
