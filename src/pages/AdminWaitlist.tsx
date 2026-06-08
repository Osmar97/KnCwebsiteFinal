import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type WaitlistRow = Tables<"tour_waitlist_requests"> & {
  tours: Pick<Tables<"tours">, "name_en"> | null;
};

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"];

const AdminWaitlist = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_waitlist_requests")
        .select("*, tours(name_en)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as WaitlistRow[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tour_waitlist_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-waitlist"] }); toast({ title: "Status updated" }); },
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  return (
    <AdminLayout title="Waitlist Requests" description="Travelers who signed up to be notified.">
      {isLoading ? <p className="text-gray-400">Loading…</p> : (data?.length ?? 0) === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">No waitlist requests yet.</div>
      ) : (
        <div className="grid gap-3">
          {data!.map((r) => (
            <div key={r.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-semibold">{r.full_name} <span className="text-gray-500 text-sm font-normal">· {r.email}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{r.phone || "no phone"} · {r.country || "—"} · {new Date(r.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-300 mt-2">Tour: <span className="text-gold">{r.tours?.name_en ?? "Any"}</span></p>
                  {r.preferred_destinations?.length > 0 && <p className="text-xs text-gray-400 mt-1">Destinations: {r.preferred_destinations.join(", ")}</p>}
                  {r.vibes?.length > 0 && <p className="text-xs text-gray-400">Vibes: {r.vibes.join(", ")}</p>}
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

export default AdminWaitlist;