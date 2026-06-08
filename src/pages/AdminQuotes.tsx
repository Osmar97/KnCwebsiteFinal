import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type QuoteRow = Tables<"tour_custom_quote_requests">;

const STATUS_OPTIONS = ["new", "in_review", "quoted", "won", "lost"];

const AdminQuotes = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_custom_quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as QuoteRow[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tour_custom_quote_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-quotes"] }); toast({ title: "Status updated" }); },
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  return (
    <AdminLayout title="Custom Quote Requests" description="Bespoke private-tour enquiries from the public site.">
      {isLoading ? <p className="text-gray-400">Loading…</p> : (data?.length ?? 0) === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">No custom quotes yet.</div>
      ) : (
        <div className="grid gap-3">
          {data!.map((r) => (
            <div key={r.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold">{r.first_name} {r.last_name} <span className="text-gray-500 text-sm font-normal">· {r.email}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{r.phone || "no phone"} · {r.country || "—"} · {r.nationality || "—"} · {new Date(r.created_at).toLocaleString()}</p>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                    <span>Guests: <span className="text-gray-200">{r.num_guests ?? "—"}</span></span>
                    <span>Days: <span className="text-gray-200">{r.num_days ?? "—"}</span></span>
                    <span>Dates: <span className="text-gray-200">{r.preferred_dates || "—"}</span></span>
                    <span>Hotel: <span className="text-gray-200">{r.hotel_preference || "—"}</span></span>
                  </div>
                  {r.destinations?.length > 0 && <p className="text-xs text-gray-400 mt-2">Destinations: <span className="text-gray-200">{r.destinations.join(", ")}</span></p>}
                  {r.vibes?.length > 0 && <p className="text-xs text-gray-400">Vibes: <span className="text-gray-200">{r.vibes.join(", ")}</span></p>}
                  {r.services?.length > 0 && <p className="text-xs text-gray-400">Services: <span className="text-gray-200">{r.services.join(", ")}</span></p>}
                  {r.notes && <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{r.notes}</p>}
                </div>
                <select value={r.status} onChange={(e) => updateStatus.mutate({ id: r.id, status: e.target.value })}
                  className="bg-black border border-gray-800 rounded-md px-2 py-2 text-sm text-white min-h-[40px]">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminQuotes;