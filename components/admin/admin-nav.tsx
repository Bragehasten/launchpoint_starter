"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNav } from "@/config/admin";
import { roleAtLeast } from "@/lib/auth-shared";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

type AdminNavProps = {
  role: UserRole;
  /** Called after navigating (closes the mobile drawer). */
  onNavigate?: () => void;
};

/** Manifest-driven admin navigation, filtered by the viewer's role. */
export function AdminNav({ role, onNavigate }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-6">
      {adminNav.map((group) => {
        const visible = group.items.filter((item) => roleAtLeast(role, item.minRole ?? "editor"));
        if (visible.length === 0) return null;

        return (
          <div key={group.title}>
            <p className="text-muted-foreground mb-2 px-3 text-xs font-medium tracking-wide uppercase">
              {group.title}
            </p>
            <ul className="flex flex-col gap-1">
              {visible.map((item) => {
                const isActive =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive && "bg-accent text-accent-foreground font-medium",
                      )}
                    >
                      <item.icon className="size-4" aria-hidden="true" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
