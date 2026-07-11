import { createClient } from "@/lib/supabase/server";
import type { Database, LocationReview, ServiceArea } from "@/types/database";

/**
 * Capability read layer. RLS already hides inactive rows from anonymous
 * visitors; ordering is by sort_order then name/title for stable output.
 */

type Tables = Database["public"]["Tables"];
export type TeamMember = Tables["team_members"]["Row"];
export type ServiceGroup = Tables["service_groups"]["Row"];
export type Service = Tables["services"]["Row"];
export type Location = Tables["locations"]["Row"];
export type Promotion = Tables["promotions"]["Row"];

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order")
    .order("name");
  return data ?? [];
}

export type ServiceGroupWithServices = ServiceGroup & { services: Service[] };

export async function getServiceGroups(): Promise<ServiceGroupWithServices[]> {
  const supabase = await createClient();
  const [{ data: groups }, { data: services }] = await Promise.all([
    supabase.from("service_groups").select("*").order("sort_order").order("name"),
    supabase.from("services").select("*").order("sort_order").order("name"),
  ]);

  return (groups ?? []).map((group) => ({
    ...group,
    services: (services ?? []).filter((service) => service.group_id === group.id),
  }));
}

export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("locations")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("sort_order");
  return data ?? [];
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data;
}

export async function getLocationReviews(locationId: string): Promise<LocationReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("location_reviews")
    .select("*")
    .eq("location_id", locationId)
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Team members assigned to a location (null location_id = all locations). */
export async function getTeamAtLocation(locationId: string): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("active", true)
    .or(`location_id.eq.${locationId},location_id.is.null`)
    .order("sort_order")
    .order("name");
  return data ?? [];
}

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotions")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Formats cents for display; null price falls back to the note or em dash. */
export function formatServicePrice(service: Service, currency = "USD"): string {
  if (service.price === null) return service.price_note ?? "—";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: service.price % 100 === 0 ? 0 : 2,
  }).format(service.price / 100);
  return service.price_note ? `${service.price_note} ${formatted}` : formatted;
}

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_areas")
    .select("*")
    .eq("active", true)
    .order("sort_order")
    .order("name");
  return data ?? [];
}

export async function getServiceAreaBySlug(slug: string): Promise<ServiceArea | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_areas")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data;
}
