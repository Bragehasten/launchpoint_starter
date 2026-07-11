import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTablePaginationProps = {
  /** Base route, e.g. "/admin/users". */
  basePath: string;
  page: number;
  pageCount: number;
  /** Extra search params to preserve (e.g. the current query). */
  searchParams?: Record<string, string | undefined>;
};

function pageHref(basePath: string, page: number, extra?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Link-based pagination — server-driven, works without JavaScript. */
export function DataTablePagination({
  basePath,
  page,
  pageCount,
  searchParams,
}: DataTablePaginationProps) {
  if (pageCount <= 1) return null;

  const linkClass = (disabled: boolean) =>
    cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      disabled && "pointer-events-none opacity-50",
    );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground mr-2 text-sm">
        Page {page} of {pageCount}
      </span>
      <Link
        href={pageHref(basePath, page - 1, searchParams)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={linkClass(page <= 1)}
      >
        <ChevronLeft aria-hidden="true" />
        Previous
      </Link>
      <Link
        href={pageHref(basePath, page + 1, searchParams)}
        aria-disabled={page >= pageCount}
        tabIndex={page >= pageCount ? -1 : undefined}
        className={linkClass(page >= pageCount)}
      >
        Next
        <ChevronRight aria-hidden="true" />
      </Link>
    </nav>
  );
}
