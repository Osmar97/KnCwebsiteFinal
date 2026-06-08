import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LIST_KEY = ["admin-properties"];

export function useAdminProperties() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("admin_list_properties");
      if (error) throw error;
      const rows = (data as any[]) ?? [];
      return rows.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    },
  });
}

export async function fetchPropertyById(id: string) {
  const { data } = await (supabase as any).rpc("admin_get_property", { _id: id });
  return Array.isArray(data) ? data[0] : data;
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("admin_get_property", { _id: id });
      if (error) throw error;
      return Array.isArray(data) ? data[0] : data;
    },
    enabled: !!id,
  });
}

export function useDeleteProperty(options?: { onSuccess?: () => void; successTitle?: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      toast({ title: options?.successTitle ?? "Property deleted" });
      options?.onSuccess?.();
    },
    onError: (e: Error) =>
      toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });
}