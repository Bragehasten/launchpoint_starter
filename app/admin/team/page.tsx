import type { Metadata } from "next";

import { deleteTeamMember, upsertTeamMember } from "@/actions/capabilities";
import { CrudManager } from "@/components/admin/crud-manager";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Team" };

export default async function AdminTeamPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Team</h1>
        <p className="text-muted-foreground text-sm">Shown on the public /team page.</p>
      </div>
      <CrudManager
        title="Team members"
        records={members ?? []}
        columns={["name", "role", "active", "sort_order"]}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "role", label: "Role", type: "text", placeholder: "Master Barber" },
          { name: "bio", label: "Bio", type: "textarea" },
          {
            name: "image",
            label: "Image URL",
            type: "text",
            hint: "Upload in Media, then paste the URL.",
          },
          { name: "active", label: "Visible on site", type: "checkbox", falseLabel: "Hidden" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertTeamMember}
        deleteAction={deleteTeamMember}
      />
    </div>
  );
}
