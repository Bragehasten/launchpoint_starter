import Link from "next/link";

import { Container } from "@/components/shared/container";
import { MobileNav } from "@/components/shared/mobile-nav";
import { NavLink } from "@/components/shared/nav-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { headerStyle } from "@/config/theme";
import { getMainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Site header with theme-driven variants (config/theme.ts):
 * - layout "split": logo left, nav + actions right (the classic).
 * - layout "centered": nav left, logo centered, actions right.
 * - sticky: pinned with blur; otherwise scrolls away.
 * - transparent: no background/border — for heroes that start at the top.
 */
export function SiteHeader() {
  const mainNav = getMainNav();
  const { layout, sticky, transparent } = headerStyle;

  const logo = (
    <Link href="/" className="text-sm font-semibold tracking-tight">
      {siteConfig.name}
    </Link>
  );

  const actions = (
    <div className="flex items-center gap-1">
      {siteConfig.headerCta ? (
        <Button asChild size="sm" className="ml-4 hidden sm:inline-flex">
          <Link href={siteConfig.headerCta.href}>{siteConfig.headerCta.title}</Link>
        </Button>
      ) : null}
      {siteConfig.features.darkModeToggle ? <ThemeToggle /> : null}
      <MobileNav siteName={siteConfig.name} items={mainNav} cta={siteConfig.headerCta} />
    </div>
  );

  const navList = (
    <ul className="hidden items-center gap-6 sm:flex">
      {mainNav.map((item) => (
        <li key={item.href}>
          <NavLink item={item} />
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={cn(
        "z-40 w-full",
        sticky && "sticky top-0",
        transparent
          ? "absolute top-0 border-b border-transparent bg-transparent"
          : "bg-background/80 border-b backdrop-blur-sm",
        transparent && sticky && "sticky",
      )}
    >
      <a
        href="#main-content"
        className="focus:bg-background focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:ring-2"
      >
        Skip to content
      </a>
      {layout === "centered" ? (
        <Container className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav aria-label="Main" className="flex items-center justify-start">
            {navList}
          </nav>
          {logo}
          <div className="flex items-center justify-end">{actions}</div>
        </Container>
      ) : (
        <Container className="flex h-14 items-center justify-between gap-4">
          {logo}
          <nav aria-label="Main" className="flex items-center gap-1">
            {navList}
            {actions}
          </nav>
        </Container>
      )}
    </header>
  );
}
