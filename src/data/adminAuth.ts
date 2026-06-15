import { supabase } from "@/integrations/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInWithPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOutCurrentUser() {
  await supabase.auth.signOut();
}

export function subscribeAuthChanges(
  cb: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange(cb);
  return data.subscription;
}