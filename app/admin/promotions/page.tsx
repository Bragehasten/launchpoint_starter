import type { Metadata } from "next";

import { deletePromotion, upsertPromotion } from "@/actions/capabilities";
import { CrudManager } from "@/components/admin/crud-manager";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Promotions" };

export default async function AdminPromotionsPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Promotions</h1>
        <p className="text-muted-foreground text-sm">
          Specials and events shown on the public /specials page. Start/end dates control visibility
          automatically.
        </p>
      </div>
      <CrudManager
        title="Promotions"
        records={promotions ?? []}
        columns={["title", "badge", "ends_at", "active"]}
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Details", type: "textarea" },
          { name: "badge", label: "Badge", type: "text", placeholder: "20% off" },
          {
            name: "starts_at",
            label: "Starts (ISO date, optional)",
            type: "text",
            placeholder: "2026-08-01",
          },
          {
            name: "ends_at",
            label: "Ends (ISO date, optional)",
            type: "text",
            placeholder: "2026-08-31",
          },
          { name: "active", label: "Active", type: "checkbox" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertPromotion}
        deleteAction={deletePromotion}
        renderCell={(record, column) => {
          if (column === "active") return record.active ? "Yes" : "Off";
          if (column === "ends_at")
            return record.ends_at
              ? new Date(String(record.ends_at)).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—";
          return String(record[column] ?? "—");
        }}
      />
    </div>
  );
}
