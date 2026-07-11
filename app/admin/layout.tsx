import type { Metadata } from "next";
import Link from "next/link";

import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminNav } from "@/components/admin/admin-nav";
import { CommandPalette } from "@/components/admin/command-palette";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/config/site";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s | Admin | ${siteConfig.name}` },
  robots: { index: false, follow: false },
};

/**
 * Admin shell. Editors and above get in; the manifest filters what each
 * role actually sees. RLS enforces the real permissions underneath.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole("editor");

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-muted/30 sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-6 border-r p-4 lg:flex">
        <Link href="/admin" className="px-3 text-sm font-semibold tracking-tight">
          {siteConfig.name}
          <span className="text-muted-foreground font-normal"> Admin</span>
        </Link>
        <AdminNav role={profile.role} />
        <div className="text-muted-foreground mt-auto px-3 text-xs">
          Signed in as {profile.email}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <AdminMobileNav role={profile.role} />
            <AdminBreadcrumbs />
          </div>
          <div className="flex items-center gap-1">
            <kbd className="text-muted-foreground bg-muted pointer-events-none hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
              ⌘K
            </kbd>
            <ThemeToggle />
          </div>
        </header>
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>

      <CommandPalette role={profile.role} />
    </div>
  );
}
