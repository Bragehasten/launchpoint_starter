import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ToastDemo } from "./toast-demo";
import { Container } from "@/components/shared/container";
import { SkeletonArticle, SkeletonCard, SkeletonList } from "@/components/shared/loading-skeletons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Component Library",
  robots: { index: false, follow: false },
};

const TOKENS = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
] as const;

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b pb-2 text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Internal style guide. Every primitive and pattern in the kit, live.
 * Not linked from anywhere and disabled in production builds.
 */
export default function ComponentsPage() {
  if (env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Container className="flex flex-col gap-12 py-12">
      <div>
        <h1 className="heading text-3xl">Component Library</h1>
        <p className="text-muted-foreground mt-2">
          Internal style guide. Marketing sections (Hero, Features, Testimonials, Pricing, FAQ, CTA,
          Logos) are demonstrated on the homepage.
        </p>
      </div>

      <Demo title="Design tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TOKENS.map((token) => (
            <div key={token} className="flex items-center gap-3">
              <div
                className="size-10 shrink-0 rounded-md border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <code className="text-xs">--{token}</code>
            </div>
          ))}
        </div>
      </Demo>

      <Demo title="Typography">
        <div className="flex flex-col gap-3">
          <h1 className="heading text-4xl">Heading 1</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
          <p className="text-lg">Lead paragraph for standfirsts and introductions.</p>
          <p>Body text. The quick brown fox jumps over the lazy dog.</p>
          <p className="text-muted-foreground text-sm">
            Muted small text for captions and metadata.
          </p>
          <code className="bg-muted w-fit rounded px-1.5 py-0.5 font-mono text-sm">
            inline code
          </code>
        </div>
      </Demo>

      <Demo title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Demo>

      <Demo title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Demo>

      <Demo title="Form elements">
        <div className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-name">Name</Label>
            <Input id="demo-name" placeholder="Jane Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-invalid">Email (invalid state)</Label>
            <Input id="demo-invalid" aria-invalid="true" defaultValue="not-an-email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-message">Message</Label>
            <Textarea id="demo-message" placeholder="How can we help?" />
          </div>
        </div>
      </Demo>

      <Demo title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Supporting description text.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Card content goes here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </Demo>

      <Demo title="Tabs">
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="text-muted-foreground text-sm">
            Account settings panel.
          </TabsContent>
          <TabsContent value="password" className="text-muted-foreground text-sm">
            Password settings panel.
          </TabsContent>
        </Tabs>
      </Demo>

      <Demo title="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>This is a modal dialog with focus trapping.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo title="Dropdown menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>

      <Demo title="Accordion">
        <Accordion type="single" collapsible className="max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes — WAI-ARIA compliant via Radix.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>Yes, and it respects reduced-motion preferences.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>

      <Demo title="Toast">
        <ToastDemo />
      </Demo>

      <Demo title="Loading skeletons">
        <div className="grid gap-8 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonList count={3} />
          <SkeletonArticle />
        </div>
      </Demo>
    </Container>
  );
}
