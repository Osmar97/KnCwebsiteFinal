import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPrice } from "@/lib/formatPrice";

const AdminBookings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_bookings")
        .select("*, tour_dates(start_date, end_date, tours(name_en, slug))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <AdminLayout title="Tour Bookings" description="Confirmed bookings from Stripe checkout and manual entries.">
      {isLoading ? <p className="text-gray-400">Loading…</p> : (data?.length ?? 0) === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">No bookings yet.</div>
      ) : (
        <div className="overflow-x-auto bg-gray-950 border border-gray-800 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Tour</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data!.map((b) => (
                <tr key={b.id} className="border-t border-gray-800">
                  <td className="px-4 py-3 text-white">{b.tour_dates?.start_date} → {b.tour_dates?.end_date}</td>
                  <td className="px-4 py-3 text-white">{b.tour_dates?.tours?.name_en ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{b.customer_name || "—"}<br/><span className="text-xs text-gray-500">{b.customer_email}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs uppercase">{b.status}</span></td>
                  <td className="px-4 py-3 text-gold">{b.amount_paid ? formatPrice(b.amount_paid) : "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{b.source}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;