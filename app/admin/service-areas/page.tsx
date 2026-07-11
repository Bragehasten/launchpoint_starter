import type { Metadata } from "next";

import { deleteServiceArea, upsertServiceArea } from "@/actions/capabilities";
import { CrudManager } from "@/components/admin/crud-manager";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Service Areas" };

export default async function AdminServiceAreasPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const { data: areas } = await supabase
    .from("service_areas")
    .select("*")
    .order("sort_order")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Service Areas</h1>
        <p className="text-muted-foreground text-sm">
          Each area gets a landing page at /service-areas/&lt;slug&gt;. Write unique copy per area —
          identical text with swapped city names hurts rankings.
        </p>
      </div>
      <CrudManager
        title="Service Areas"
        records={areas ?? []}
        columns={["name", "region", "slug", "active"]}
        fields={[
          { name: "name", label: "Area name", type: "text", placeholder: "Jupiter" },
          { name: "region", label: "State / region", type: "text", placeholder: "FL" },
          {
            name: "slug",
            label: "Slug",
            type: "text",
            placeholder: "jupiter",
            hint: "URL: /service-areas/<slug>",
          },
          {
            name: "intro",
            label: "Intro (unique per area)",
            type: "textarea",
            hint: "1–3 sentences specific to this area: neighborhoods, common jobs, local specifics.",
          },
          {
            name: "body",
            label: "Body",
            type: "textarea",
            hint: "Optional longer copy. Blank lines become paragraphs.",
          },
          {
            name: "faqs",
            label: "FAQs (JSON)",
            type: "json",
            placeholder: '[{"question":"Do you serve …?","answer":"Yes — …"}]',
            hint: "Rendered as an accordion + FAQPage structured data.",
          },
          { name: "active", label: "Visible on site", type: "checkbox" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertServiceArea}
        deleteAction={deleteServiceArea}
        toFormValues={(record) => ({
          ...record,
          faqs: JSON.stringify(record.faqs ?? [], null, 0),
        })}
        renderCell={(record, column) =>
          column === "active" ? (record.active ? "Yes" : "Hidden") : String(record[column] ?? "—")
        }
      />
    </div>
  );
}
