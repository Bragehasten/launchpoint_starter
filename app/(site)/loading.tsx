import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for (site) pages: a neutral hero-shaped skeleton that
 * works for any capability route without guessing at page structure.
 */
export default function SiteLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:py-24">
      <div role="status" aria-label="Loading page" className="contents">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-sm" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40 max-lg:hidden" />
        </div>
      </div>
    </div>
  );
}
