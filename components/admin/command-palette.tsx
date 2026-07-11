"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { adminNavItems } from "@/config/admin";
import { roleAtLeast } from "@/lib/auth-shared";
import type { UserRole } from "@/types/database";

/** Cmd+K command palette: navigation + quick actions. */
export function CommandPalette({ role }: { role: UserRole }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const items = adminNavItems.filter((item) => roleAtLeast(role, item.minRole ?? "editor"));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {items.map((item) => (
            <CommandItem key={item.href} onSelect={() => run(() => router.push(item.href))}>
              <item.icon aria-hidden="true" />
              {item.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => run(() => setTheme("light"))}>
            <Sun aria-hidden="true" />
            Light mode
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme("dark"))}>
            <Moon aria-hidden="true" />
            Dark mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
