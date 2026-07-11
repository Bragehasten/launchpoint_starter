"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary: catches render/data errors below the root
 * layout, so the page chrome (header, theme) stays intact. `reset()`
 * re-renders the segment — often enough for transient data failures.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console and in Vercel's client error reporting.
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          An unexpected error occurred while loading this page. It&apos;s been logged
          {error.digest ? ` (reference: ${error.digest})` : ""} — try again, or come back in a
          moment.
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        <RotateCcw aria-hidden="true" />
        Try again
      </Button>
    </main>
  );
}
