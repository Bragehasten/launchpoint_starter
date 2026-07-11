"use client";

import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { updateUserRole } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole } from "@/types/database";

const ROLES: UserRole[] = ["admin", "editor", "user"];

type RoleMenuProps = {
  userId: string;
  currentRole: UserRole;
  /** Disable self-demotion in the UI (the action enforces it server-side too). */
  isSelf: boolean;
};

export function RoleMenu({ userId, currentRole, isSelf }: RoleMenuProps) {
  async function changeRole(role: UserRole) {
    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("role", role);
    await updateUserRole(formData);
    toast.success(`Role updated to ${role}.`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change role">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Set role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((role) => (
          <DropdownMenuItem
            key={role}
            disabled={role === currentRole || (isSelf && role !== "admin")}
            onClick={() => changeRole(role)}
            className="capitalize"
          >
            {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
