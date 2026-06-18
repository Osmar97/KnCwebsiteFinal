import { supabase } from "@/integrations/supabase/client";

// ---------- Settings ----------
export interface PrivateTourSettings {
  min_days: number;
  max_days: number;
  default_currency: string;
  deposit_ratio: number;
  promo_label: string | null;
  promo_discount_pct: number | null;
}

export async function fetchPrivateTourSettings() {
  const { data, error } = await supabase
    .from("private_tour_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function savePrivateTourSettings(s: PrivateTourSettings) {
  const { error } = await supabase
    .from("private_tour_settings")
    .upsert({ id: true, ...s }, { onConflict: "id" });
  if (error) throw error;
}

// ---------- Tour Dates (admin) ----------
export async function fetchAdminTourList() {
  const { data, error } = await supabase.from("tours").select("id,name_en").order("name_en");
  if (error) throw error;
  return data ?? [];
}

export async function fetchUpcomingTourDates() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tour_dates")
    .select("*")
    .gte("start_date", todayIso)
    .order("start_date");
  if (error) throw error;
  return data ?? [];
}

export async function upsertTourDate(row: { id?: string } & Record<string, unknown>) {
  const { id, ...rest } = row;
  const { error } = id
    ? await supabase.from("tour_dates").update(rest as never).eq("id", id)
    : await supabase.from("tour_dates").insert(rest as never);
  if (error) throw error;
}

export async function deleteTourDate(id: string) {
  const { error } = await supabase.from("tour_dates").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Destinations ----------
export async function fetchTourDestinationsAdmin() {
  const { data, error } = await supabase
    .from("tour_destinations")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublicWhereWeGoDestinations() {
  const { data, error } = await supabase
    .from("tour_destinations")
    .select("id, slug, flag, label_en, label_pt, label_fr, desc_en, desc_pt, desc_fr, region, card_image_url, hero_image_url, sort_order, active, archived")
    .eq("active", true)
    .eq("archived", false)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function uploadDestinationImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `tour-destinations/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function upsertTourDestination(row: { id?: string } & Record<string, unknown>) {
  const { id, ...rest } = row;
  const { error } = id
    ? await supabase.from("tour_destinations").update(rest as never).eq("id", id)
    : await supabase.from("tour_destinations").insert(rest as never);
  if (error) throw error;
}

export async function deleteTourDestination(id: string) {
  const { error } = await supabase.from("tour_destinations").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Add-ons ----------
export async function fetchTourAddons() {
  const { data, error } = await supabase
    .from("tour_addons")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function upsertTourAddon(row: { id?: string } & Record<string, unknown>) {
  const { id, ...rest } = row;
  const { error } = id
    ? await supabase.from("tour_addons").update(rest as never).eq("id", id)
    : await supabase.from("tour_addons").insert(rest as never);
  if (error) throw error;
}

export async function deleteTourAddon(id: string) {
  const { error } = await supabase.from("tour_addons").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Included items ----------
export async function fetchTourIncludedItems() {
  const { data, error } = await supabase
    .from("tour_included_items")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function upsertTourIncludedItem(row: { id?: string } & Record<string, unknown>) {
  const { id, ...rest } = row;
  const { error } = id
    ? await supabase.from("tour_included_items").update(rest as never).eq("id", id)
    : await supabase.from("tour_included_items").insert(rest as never);
  if (error) throw error;
}

export async function deleteTourIncludedItem(id: string) {
  const { error } = await supabase.from("tour_included_items").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Bookings ----------
export async function fetchTourBookings() {
  const { data, error } = await supabase
    .from("tour_bookings")
    .select("*, tour_dates(start_date, end_date, tours(name_en, slug))")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}