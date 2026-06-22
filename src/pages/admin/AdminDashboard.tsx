import AdminLayout from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { Building2, FileBox, MapPin, Calendar, ClipboardList, Sparkles, Inbox, Plus, Upload } from "lucide-react";
import { useAdminCounts } from "@/hooks/admin/useAdminCounts";
import type { UseQueryResult } from "@tanstack/react-query";

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

const AdminDashboard = () => {
  const { properties, toursPublished, bookings, waitlist, quotes } = useAdminCounts();
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
        <Stat label="New Leads" value={waitlist.isLoading || quotes.isLoading ? "…" : totalLeads} icon={Inbox} to="/admin/waitlist" />
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
    </AdminLayout>
  );
};

export default AdminDashboard;