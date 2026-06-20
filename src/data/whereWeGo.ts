import { supabase } from "@/integrations/supabase/client";

export type WhereWeGoCard = {
  id?: string;
  country_name_en: string;
  country_name_pt: string | null;
  country_name_fr: string | null;
  subtitle_en: string | null;
  subtitle_pt: string | null;
  subtitle_fr: string | null;
  description_en: string | null;
  description_pt: string | null;
  description_fr: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

const TABLE = "tour_where_we_go" as const;
const BUCKET = "property-images";
const FOLDER = "where-we-go";

export async function fetchWhereWeGoPublic(): Promise<WhereWeGoCard[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WhereWeGoCard[];
}

export async function fetchWhereWeGoAdmin(): Promise<WhereWeGoCard[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WhereWeGoCard[];
}

export async function upsertWhereWeGo(row: WhereWeGoCard): Promise<WhereWeGoCard> {
  const { id, ...rest } = row;
  const result = id
    ? await supabase.from(TABLE).update(rest as never).eq("id", id).select("*").single()
    : await supabase.from(TABLE).insert(rest as never).select("*").single();
  if (result.error) throw result.error;
  return result.data as WhereWeGoCard;
}

export async function deleteWhereWeGo(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadWhereWeGoImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${FOLDER}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}