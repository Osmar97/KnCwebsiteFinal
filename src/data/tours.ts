import { supabase } from "@/integrations/supabase/client";

export interface TourDateMutation {
  id?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean;
  label: string | null;
  _isNew?: boolean;
  _delete?: boolean;
}

export async function uploadTourImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `tours/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveTourRecord(
  tourId: string | null,
  payload: Record<string, unknown>
): Promise<string> {
  if (tourId) {
    const { error } = await supabase.from("tours").update(payload as never).eq("id", tourId);
    if (error) throw error;
    return tourId;
  }
  const { data, error } = await supabase
    .from("tours")
    .insert(payload as never)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function syncTourDateRows(tourId: string, dates: TourDateMutation[]) {
  for (const d of dates) {
    if (d._delete && d.id) {
      const { error } = await supabase.from("tour_dates").delete().eq("id", d.id);
      if (error) throw error;
    } else if (d._isNew) {
      const { error } = await supabase.from("tour_dates").insert({
        tour_id: tourId,
        start_date: d.start_date,
        end_date: d.end_date,
        capacity: Number(d.capacity) || 0,
        sold_out: !!d.sold_out,
        label: d.label || null,
      });
      if (error) throw error;
    } else if (d.id) {
      const { error } = await supabase
        .from("tour_dates")
        .update({
          start_date: d.start_date,
          end_date: d.end_date,
          capacity: Number(d.capacity) || 0,
          sold_out: !!d.sold_out,
          label: d.label || null,
        })
        .eq("id", d.id);
      if (error) throw error;
    }
  }
}