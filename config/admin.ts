import {
  BadgePercent,
  CalendarCheck,
  CreditCard,
  FileText,
  Image,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Map,
  MapPin,
  PanelsTopLeft,
  Settings,
  Sparkles,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import { enabledCapabilities } from "@/lib/capabilities";
import type { CapabilityKey } from "@/lib/capabilities/types";

import type { UserRole } from "@/types/database";

/**
 * Admin navigation manifest.
 *
 * The admin shell renders whatever this manifest declares — capabilities
 * (menu, booking, gallery...) will append their own entries here when the
 * capability layer lands (M10), lighting up their admin sections without
 * touching the shell.
 */

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Minimum role required to see this entry. Defaults to "editor". */
  minRole?: UserRole;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

/**
 * Capability admin auto-mount: enabling a capability in the client config
 * lights up its admin section — the shell never changes.
 */
const CAPABILITY_ADMIN: Partial<Record<CapabilityKey, AdminNavItem>> = {
  booking: { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  team: { title: "Team", href: "/admin/team", icon: UsersRound },
  services: { title: "Services", href: "/admin/services", icon: ListChecks },
  locations: { title: "Locations", href: "/admin/locations", icon: MapPin },
  promotions: { title: "Promotions", href: "/admin/promotions", icon: BadgePercent },
  serviceAreas: { title: "Service Areas", href: "/admin/service-areas", icon: Map },
};

function capabilityAdminItems(): AdminNavItem[] {
  return enabledCapabilities()
    .map((key) => CAPABILITY_ADMIN[key])
    .filter((item): item is AdminNavItem => item !== undefined);
}

export const adminNav: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { title: "Posts", href: "/admin/posts", icon: FileText },
      { title: "Pages", href: "/admin/pages", icon: PanelsTopLeft },
      { title: "Media", href: "/admin/media", icon: Image },
      { title: "Inbox", href: "/admin/inbox", icon: Inbox },
      { title: "AI Studio", href: "/admin/ai", icon: Sparkles },
    ],
  },
  {
    title: "Capabilities",
    items: capabilityAdminItems(),
  },
  {
    title: "Manage",
    items: [
      { title: "Payments", href: "/admin/payments", icon: CreditCard, minRole: "admin" },
      { title: "Users", href: "/admin/users", icon: Users, minRole: "admin" },
      { title: "Settings", href: "/admin/settings", icon: Settings, minRole: "admin" },
    ],
  },
];

/** Flat list used by breadcrumbs and the command palette. */
export const adminNavItems: AdminNavItem[] = adminNav.flatMap((group) => group.items);
