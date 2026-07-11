"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserRole } from "@/types/database";

/** Drawer version of the admin sidebar for small screens. */
export function AdminMobileNav({ role }: { role: UserRole }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu">
          <PanelLeft className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">Admin</SheetTitle>
        </SheetHeader>
        <AdminNav role={role} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
