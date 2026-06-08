import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type WaitlistRow = Tables<"tour_waitlist_requests"> & {
  tours: Pick<Tables<"tours">, "name_en"> | null;
};

const QUERY_KEY = ["admin-waitlist"];

export function useAdminWaitlist() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_waitlist_requests")
        .select("*, tours(name_en)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as WaitlistRow[];
    },
  });
}

export function useUpdateWaitlistStatus() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("tour_waitlist_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast({ title: "Status updated" });
    },
    onError: (e: Error) =>
      toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });
}