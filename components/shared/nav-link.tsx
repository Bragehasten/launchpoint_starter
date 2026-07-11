"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/site";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  item: NavItem;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

/** Nav link with automatic active-route styling and aria-current. */
export function NavLink({ item, className, activeClassName, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "text-muted-foreground hover:text-foreground text-sm transition-colors",
        isActive && cn("text-foreground font-medium", activeClassName),
        className,
      )}
      {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {item.title}
    </Link>
  );
}
