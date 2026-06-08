import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

export type TourWithDates = Tables<"tours"> & {
  tour_dates: Tables<"tour_dates">[];
};

const QUERY_KEY = ["admin-tours"];

export function useAdminTours() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*, tour_dates(*)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as TourWithDates[];
    },
  });
}

export function useInvalidateAdminTours() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: QUERY_KEY });
}

export function useUpdateTourStatus() {
  const invalidate = useInvalidateAdminTours();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tours").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      invalidate();
      toast({ title: `Tour ${v.status}` });
    },
    onError: (e: Error) =>
      toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteTour() {
  const invalidate = useInvalidateAdminTours();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tours").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Tour deleted" });
    },
    onError: (e: Error) =>
      toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });
}

export function useDuplicateTour(source: TourWithDates[] | undefined) {
  const invalidate = useInvalidateAdminTours();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const src = source?.find((t) => t.id === id);
      if (!src) throw new Error("Source tour not found");
      const { id: _i, created_at: _c, updated_at: _u, tour_dates: _d, ...rest } = src;
      const insert = {
        ...rest,
        slug: `${src.slug}-copy-${Date.now().toString(36)}`,
        name_en: `${src.name_en} (Copy)`,
        status: "draft",
      };
      const { error } = await supabase.from("tours").insert(insert);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Tour duplicated" });
    },
    onError: (e: Error) =>
      toast({ title: "Duplicate failed", description: e.message, variant: "destructive" }),
  });
}

/** Load a single tour with its dates (used by the editor). */
export function useAdminTour(tourId: string | null) {
  return useQuery({
    queryKey: ["admin-tour", tourId],
    queryFn: async () => {
      if (!tourId) return null;
      const { data, error } = await supabase
        .from("tours")
        .select("*, tour_dates(*)")
        .eq("id", tourId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!tourId,
  });
}