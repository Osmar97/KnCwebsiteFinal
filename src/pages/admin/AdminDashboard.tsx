import AdminLayout from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { Building2, FileBox, MapPin, Calendar, ClipboardList, Sparkles, Inbox, Plus, Upload, Activity } from "lucide-react";
import { useAdminCounts } from "@/hooks/admin/useAdminCounts";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatProps {
  label: string;
  value: number | string;
  icon: any;
  to?: string;
  accent?: string;
}

const Stat = ({ label, value, icon: Icon, to, accent }: StatProps) => {
  const body = (
    <div className="bg-gray-950 border border-gray-800 hover:border-gold/50 transition-colors rounded-lg p-4 sm:p-5 h-full">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 truncate">{label}</p>
          <p className={`text-2xl sm:text-3xl font-bold mt-2 ${accent ?? "text-white"}`}>{value}</p>
        </div>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
};

interface ActivityItem {
  id: string;
  type: string;
  label: string;
  detail: string;
  createdAt: string;
  href: string;
}

const useRecentActivity = () =>
  useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async (): Promise<ActivityItem[]> => {
      const [bookings, waitlist, quotes, tours, properties] = await Promise.all([
        supabase.from("tour_bookings").select("id, created_at, status").order("created_at", { ascending: false }).limit(5),
        supabase.from("tour_waitlist_requests").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("tour_custom_quote_requests").select("id, first_name, last_name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("tours").select("id, name_en, status, updated_at").order("updated_at", { ascending: false }).limit(5),
        supabase.from("properties").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      const items: ActivityItem[] = [];
      (bookings.data ?? []).forEach((b: any) =>
        items.push({ id: `b-${b.id}`, type: "Booking", label: "New Booking", detail: b.status ?? "", createdAt: b.created_at, href: "/admin/bookings" }),
      );
      (waitlist.data ?? []).forEach((w: any) =>
        items.push({ id: `w-${w.id}`, type: "Waitlist", label: "New Waitlist Request", detail: w.full_name || w.email || "", createdAt: w.created_at, href: "/admin/waitlist" }),
      );
      (quotes.data ?? []).forEach((q: any) =>
        items.push({ id: `q-${q.id}`, type: "Quote", label: "New Quote Request", detail: [q.first_name, q.last_name].filter(Boolean).join(" ") || q.email || "", createdAt: q.created_at, href: "/admin/quotes" }),
      );
      (tours.data ?? []).forEach((t: any) =>
        items.push({ id: `t-${t.id}`, type: "Tour", label: t.status === "published" ? "Tour Published" : "Tour Updated", detail: t.name_en ?? "", createdAt: t.updated_at, href: "/admin/tours" }),
      );
      (properties.data ?? []).forEach((p: any) =>
        items.push({ id: `p-${p.id}`, type: "Property", label: "Property Added", detail: p.title ?? "", createdAt: p.created_at, href: "/admin/properties" }),
      );
      return items
        .filter((i) => i.createdAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12);
    },
  });

const AdminDashboard = () => {
  const { properties, toursPublished, bookings, waitlist, quotes } = useAdminCounts();
  const activity = useRecentActivity();
  const n = (q: UseQueryResult<number>) => (q.isLoading ? "…" : q.data ?? 0);
  const totalLeads = (waitlist.data ?? 0) + (quotes.data ?? 0);

  return (
    <AdminLayout title="Dashboard" description="High-level overview of platform activity.">
      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="Total Properties" value={n(properties)} icon={Building2} to="/admin/properties" />
        <Stat label="Total Assets" value="Manage" icon={FileBox} to="/admin/assets" />
        <Stat label="Active Tours" value={n(toursPublished)} icon={MapPin} accent="text-emerald-400" to="/admin/tours" />
        <Stat label="Total Bookings" value={n(bookings)} icon={Calendar} to="/admin/bookings" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <Stat label="Waitlist Requests" value={n(waitlist)} icon={ClipboardList} to="/admin/waitlist" />
        <Stat label="Custom Quote Requests" value={n(quotes)} icon={Sparkles} to="/admin/quotes" />
        <Stat label="All Leads" value={waitlist.isLoading || quotes.isLoading ? "…" : totalLeads} icon={Inbox} to="/admin/leads" />
        <Stat label="Revenue" value="—" icon={Calendar} accent="text-gray-500" />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-950 border border-gray-800 rounded-lg p-4 sm:p-5">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Link
            to="/admin/tours?new=1"
            className="px-4 py-3 rounded-md bg-gold text-black text-sm font-medium hover:bg-gold-dark min-h-[44px] inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Tour
          </Link>
          <Link
            to="/admin/properties"
            className="px-4 py-3 rounded-md border border-gold text-gold text-sm font-medium hover:bg-gold hover:text-black min-h-[44px] inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Property
          </Link>
          <Link
            to="/admin/assets"
            className="px-4 py-3 rounded-md border border-gold text-gold text-sm font-medium hover:bg-gold hover:text-black min-h-[44px] inline-flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Asset
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 sm:mt-8 bg-gray-950 border border-gray-800 rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold" /> Recent Activity
          </h2>
        </div>
        {activity.isLoading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : (activity.data?.length ?? 0) === 0 ? (
          <p className="text-gray-500 text-sm">No recent activity yet.</p>
        ) : (
          <ul className="divide-y divide-gray-800">
            {activity.data!.map((it) => (
              <li key={it.id}>
                <Link
                  to={it.href}
                  className="flex items-start justify-between gap-3 py-3 hover:bg-gray-900/40 -mx-2 px-2 rounded-md"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">
                      <span className="text-gold mr-2 text-[10px] uppercase tracking-wider">{it.type}</span>
                      {it.label}
                    </p>
                    {it.detail && <p className="text-xs text-gray-400 truncate mt-0.5">{it.detail}</p>}
                  </div>
                  <span className="text-[11px] text-gray-500 flex-shrink-0 whitespace-nowrap">
                    {new Date(it.createdAt).toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;