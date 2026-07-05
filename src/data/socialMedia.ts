import { supabase } from "@/integrations/supabase/client";

export type SocialLinks = {
  id?: string;
  instagram_url: string;
  instagram_username: string;
  facebook_url: string;
  linkedin_url: string;
};

export type IgImage = {
  id?: string;
  image_url: string;
  post_url: string | null;
  caption: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
};

const LINKS = "site_social_links" as const;
const IMAGES = "instagram_showcase_images" as const;
const BUCKET = "property-images";
const FOLDER = "instagram-showcase";

export async function fetchSocialLinks(): Promise<SocialLinks | null> {
  const { data, error } = await supabase.from(LINKS).select("*").limit(1).maybeSingle();
  if (error) throw error;
  return (data as SocialLinks) ?? null;
}

export async function upsertSocialLinks(row: SocialLinks): Promise<SocialLinks> {
  const { id, ...rest } = row;
  const result = id
    ? await supabase.from(LINKS).update(rest as never).eq("id", id).select("*").single()
    : await supabase.from(LINKS).insert(rest as never).select("*").single();
  if (result.error) throw result.error;
  return result.data as SocialLinks;
}

export async function fetchIgImagesPublic(): Promise<IgImage[]> {
  const { data, error } = await supabase
    .from(IMAGES)
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as IgImage[];
}

export async function fetchIgImagesAdmin(): Promise<IgImage[]> {
  const { data, error } = await supabase
    .from(IMAGES)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as IgImage[];
}

export async function upsertIgImage(row: IgImage): Promise<IgImage> {
  const { id, ...rest } = row;
  const result = id
    ? await supabase.from(IMAGES).update(rest as never).eq("id", id).select("*").single()
    : await supabase.from(IMAGES).insert(rest as never).select("*").single();
  if (result.error) throw result.error;
  return result.data as IgImage;
}

export async function deleteIgImage(id: string): Promise<void> {
  const { error } = await supabase.from(IMAGES).delete().eq("id", id);
  if (error) throw error;
}

export async function uploadIgImage(file: File): Promise<string> {
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