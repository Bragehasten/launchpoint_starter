import type { Metadata } from "next";

import {
  deleteService,
  deleteServiceGroup,
  upsertService,
  upsertServiceGroup,
} from "@/actions/capabilities";
import { CrudManager } from "@/components/admin/crud-manager";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const [{ data: groups }, { data: services }] = await Promise.all([
    supabase.from("service_groups").select("*").order("sort_order").order("name"),
    supabase.from("services").select("*").order("sort_order").order("name"),
  ]);

  const groupOptions = (groups ?? []).map((group) => ({ value: group.id, label: group.name }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="heading text-2xl">Services</h1>
        <p className="text-muted-foreground text-sm">
          Groups and items shown on the public /menu page.
        </p>
      </div>

      <CrudManager
        title="Groups"
        records={groups ?? []}
        columns={["name", "sort_order"]}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Haircuts" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertServiceGroup}
        deleteAction={deleteServiceGroup}
      />

      <CrudManager
        title="Items"
        records={services ?? []}
        columns={["name", "group_id", "price", "active"]}
        fields={[
          {
            name: "group_id",
            label: "Group",
            type: "select",
            options: groupOptions,
            placeholder: "Pick a group",
          },
          { name: "name", label: "Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "price",
            label: "Price ($)",
            type: "number",
            step: "0.01",
            hint: "Leave empty for “market price” / hidden.",
            format: "currency-cents",
            fallbackField: "price_note",
          },
          { name: "price_note", label: "Price note", type: "text", placeholder: "from" },
          { name: "active", label: "Visible on site", type: "checkbox", falseLabel: "Hidden" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertService}
        deleteAction={deleteService}
      />
    </div>
  );
}
