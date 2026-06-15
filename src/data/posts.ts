import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/contexts/PostsContext";

type PostCategory = Post["category"];

export async function listPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function createPostRecord(payload: {
  title: string; content: string; images: string[];
  pdf_urls: string[]; video_urls: string[]; category: PostCategory;
}) {
  const { data, error } = await supabase.from("posts").insert([payload]).select();
  if (error) throw error;
  return (data?.[0] ?? null) as Post | null;
}

export async function updatePostRecord(id: string, payload: {
  title: string; content: string; images: string[];
  pdf_urls: string[]; video_urls: string[]; category: PostCategory;
}) {
  const { data, error } = await supabase
    .from("posts")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return (data?.[0] ?? null) as Post | null;
}

export async function deletePostRecord(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}