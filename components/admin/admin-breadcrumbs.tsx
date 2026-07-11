"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { adminNavItems } from "@/config/admin";

/** Breadcrumbs derived from the pathname, labeled via the admin manifest. */
export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const manifestItem = adminNavItems.find((item) => item.href === href);
    const label =
      manifestItem?.title ?? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-muted-foreground flex items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="size-3.5" aria-hidden="true" /> : null}
              {isLast ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
