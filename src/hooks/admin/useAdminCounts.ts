import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type CountableTable =
  | "properties"
  | "tours"
  | "tour_bookings"
  | "tour_waitlist_requests"
  | "tour_custom_quote_requests";

type Filter = (q: any) => any;

const countOf = async (table: CountableTable, filter?: Filter) => {
  let q = supabase.from(table as any).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
};

const useCount = (key: string, table: CountableTable, filter?: Filter) =>
  useQuery({ queryKey: ["admin-count", key], queryFn: () => countOf(table, filter) });

export function useAdminCounts() {
  return {
    properties: useCount("properties", "properties"),
    tours: useCount("tours", "tours"),
    toursPublished: useCount("tours-published", "tours", (q) => q.eq("status", "published")),
    toursDraft: useCount("tours-draft", "tours", (q) => q.eq("status", "draft")),
    bookings: useCount("tour_bookings", "tour_bookings"),
    waitlist: useCount("tour_waitlist_requests", "tour_waitlist_requests"),
    quotes: useCount("tour_custom_quote_requests", "tour_custom_quote_requests"),
  };
}