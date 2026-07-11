import { ShieldCheck, UserPlus, Users } from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { createClient } from "@/lib/supabase/server";

/** Dashboard home. Stat sources grow as capabilities land (posts, bookings...). */
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [total, newThisWeek, admins] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">What&apos;s happening on the site.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total users" value={total.count ?? 0} icon={Users} />
        <StatCard
          title="New this week"
          value={newThisWeek.count ?? 0}
          hint="Signups in the last 7 days"
          icon={UserPlus}
        />
        <StatCard title="Admins" value={admins.count ?? 0} icon={ShieldCheck} />
      </div>
    </div>
  );
}
