// KTTC client: re-exports the host's single Supabase client (same project),
// cast to KTTC's Database typings so KTTC code keeps type-safe access to its tables.
import { supabase as hostSupabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export const supabase = hostSupabase as unknown as SupabaseClient<Database>;
