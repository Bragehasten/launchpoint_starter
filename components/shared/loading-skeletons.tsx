import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Composed skeleton patterns for loading.tsx files and Suspense fallbacks.
 * Match the pattern to the content shape it stands in for.
 */

/** Placeholder for a content card (blog post preview, feature card...). */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
    </Card>
  );
}

/** Grid of card placeholders. */
export function SkeletonCardGrid({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Placeholder for a list of rows with avatars (users, comments...). */
export function SkeletonList({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder for a full article (blog post page). */
export function SkeletonArticle({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="mt-4 aspect-video w-full rounded-xl" />
      <div className="mt-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
