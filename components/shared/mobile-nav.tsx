"use client";

import * as React from "react";
import { LocalLink as Link } from "@/components/shared/local-link";
import { Menu } from "lucide-react";

import { NavLink } from "@/components/shared/nav-link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavItem } from "@/config/site";

type MobileNavProps = {
  siteName: string;
  items: NavItem[];
  cta?: NavItem;
};

/** Drawer navigation for small screens. Closes automatically on navigation. */
export function MobileNav({ siteName, items, cta }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle asChild>
            <Link href="/" onClick={close} className="text-left font-semibold tracking-tight">
              {siteName}
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  onNavigate={close}
                  className="hover:bg-accent block rounded-md px-3 py-2 text-base"
                />
              </li>
            ))}
          </ul>
        </nav>
        {cta ? (
          <Button asChild className="mt-2 rounded-full">
            <Link href={cta.href} onClick={close}>
              {cta.title}
            </Link>
          </Button>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
