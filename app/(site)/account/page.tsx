import type { Metadata } from "next";

import { signOut } from "@/actions/auth";
import { Container, Section } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

/** Minimal protected page proving the auth loop end-to-end. */
export default async function AccountPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  return (
    <Section>
      <Container className="max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Account</CardTitle>
            <CardDescription>Signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{profile?.full_name ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary">{profile?.role ?? "user"}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <form action={signOut} className="w-full">
              <Button type="submit" variant="outline" className="w-full">
                Sign out
              </Button>
            </form>
          </CardFooter>
        </Card>
      </Container>
    </Section>
  );
}
