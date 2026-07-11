import type { Metadata } from "next";

import {
  deleteLocation,
  deleteLocationReview,
  upsertLocation,
  upsertLocationReview,
} from "@/actions/capabilities";
import { CrudManager } from "@/components/admin/crud-manager";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const [{ data: locations }, { data: reviews }] = await Promise.all([
    supabase
      .from("locations")
      .select("*")
      .order("is_primary", { ascending: false })
      .order("sort_order"),
    supabase
      .from("location_reviews")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false }),
  ]);

  const locationOptions = (locations ?? []).map((l) => ({ value: l.id, label: l.name }));
  const locationName = new Map((locations ?? []).map((l) => [l.id, l.name]));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="heading text-2xl">Locations</h1>
        <p className="text-muted-foreground text-sm">
          Each location gets its own landing page at /locations/&lt;slug&gt;.
        </p>
      </div>
      <CrudManager
        title="Locations"
        records={locations ?? []}
        columns={["name", "slug", "address", "phone", "is_primary"]}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Downtown" },
          {
            name: "slug",
            label: "Slug",
            type: "text",
            placeholder: "downtown",
            hint: "URL: /locations/<slug>. Lowercase, dashes.",
          },
          { name: "address", label: "Street address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "region", label: "State / region", type: "text", placeholder: "TX" },
          { name: "postal_code", label: "Postal code", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "text" },
          {
            name: "intro",
            label: "Intro",
            type: "textarea",
            hint: "Unique copy for this location's page — matters for SEO.",
          },
          {
            name: "hours",
            label: "Hours (JSON)",
            type: "json",
            placeholder: '[{"days":"Mon–Fri","hours":"9:00–18:00"}]',
            hint: "One entry per line group; leave empty to hide hours.",
          },
          {
            name: "map_url",
            label: "Map link",
            type: "text",
            placeholder: "https://maps.google.com/…",
          },
          {
            name: "map_embed_url",
            label: "Map embed URL",
            type: "text",
            placeholder: "https://www.google.com/maps/embed?pb=…",
            hint: "Google Maps → Share → Embed a map → copy the src URL.",
          },
          { name: "latitude", label: "Latitude", type: "text", placeholder: "30.2672" },
          { name: "longitude", label: "Longitude", type: "text", placeholder: "-97.7431" },
          { name: "is_primary", label: "Primary location", type: "checkbox" },
          { name: "active", label: "Visible on site", type: "checkbox" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertLocation}
        deleteAction={deleteLocation}
        toFormValues={(record) => ({
          ...record,
          hours: JSON.stringify(record.hours ?? [], null, 0),
          latitude: record.latitude ?? "",
          longitude: record.longitude ?? "",
        })}
        renderCell={(record, column) =>
          column === "is_primary"
            ? record.is_primary
              ? "Yes"
              : "—"
            : String(record[column] ?? "—")
        }
      />

      <CrudManager
        title="Reviews"
        records={reviews ?? []}
        columns={["author", "rating", "location_id", "published"]}
        fields={[
          { name: "location_id", label: "Location", type: "select", options: locationOptions },
          { name: "author", label: "Author", type: "text", placeholder: "Maria G." },
          { name: "rating", label: "Rating (1–5)", type: "number" },
          { name: "body", label: "Review", type: "textarea" },
          {
            name: "source",
            label: "Source",
            type: "select",
            options: [
              { value: "google", label: "Google" },
              { value: "yelp", label: "Yelp" },
              { value: "facebook", label: "Facebook" },
              { value: "direct", label: "Direct" },
            ],
          },
          { name: "published", label: "Published", type: "checkbox" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        upsertAction={upsertLocationReview}
        deleteAction={deleteLocationReview}
        renderCell={(record, column) =>
          column === "location_id"
            ? (locationName.get(String(record.location_id)) ?? "—")
            : column === "published"
              ? record.published
                ? "Yes"
                : "Hidden"
              : String(record[column] ?? "—")
        }
      />
    </div>
  );
}
