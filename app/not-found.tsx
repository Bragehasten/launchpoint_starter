import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

/**
 * Root 404 — also what disabled-capability routes render via notFound(),
 * so the copy stays generic and points back to safety.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        <ArrowLeft aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}
