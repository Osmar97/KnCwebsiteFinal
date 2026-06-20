import AdminLayout from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { Building2, FileBox, MapPin, Calendar, ClipboardList, Sparkles, CheckCircle2, FileEdit, Settings, Globe, PackagePlus, ListChecks } from "lucide-react";
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
    <div className="bg-gray-950 border border-gray-800 hover:border-gold/50 transition-colors rounded-lg p-5 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${accent ?? "text-white"}`}>{value}</p>
        </div>
        <Icon className="w-6 h-6 text-gold" />
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
};

const AdminDashboard = () => {
  const { properties, tours, toursPublished, toursDraft, bookings, waitlist, quotes } = useAdminCounts();
  const n = (q: UseQueryResult<number>) => (q.isLoading ? "…" : q.data ?? 0);

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of platform content and recent activity.">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <Stat label="Properties" value={n(properties)} icon={Building2} to="/admin/properties" />
        <Stat label="Total Tours" value={n(tours)} icon={MapPin} to="/admin/tours" />
        <Stat label="Where We Go" value="Manage" icon={Globe} to="/admin/tours/where-we-go" />
        <Stat label="Active Tours" value={n(toursPublished)} icon={CheckCircle2} accent="text-emerald-400" to="/admin/tours" />
        <Stat label="Draft Tours" value={n(toursDraft)} icon={FileEdit} accent="text-amber-400" to="/admin/tours" />
        <Stat label="Tour Bookings" value={n(bookings)} icon={Calendar} to="/admin/bookings" />
        <Stat label="Waitlist Requests" value={n(waitlist)} icon={ClipboardList} to="/admin/waitlist" />
        <Stat label="Custom Quote Requests" value={n(quotes)} icon={Sparkles} to="/admin/quotes" />
        <Stat label="Assets Library" value="Manage" icon={FileBox} to="/admin/assets" />
      </div>

      <h2 className="text-lg font-semibold text-gold mt-10 mb-3">Private Tour Configuration</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <Stat label="PT · Settings" value="Edit" icon={Settings} to="/admin/private-tour/settings" />
        <Stat label="PT · Destinations" value="Manage" icon={Globe} to="/admin/private-tour/destinations" />
        <Stat label="PT · Add-Ons" value="Manage" icon={PackagePlus} to="/admin/private-tour/addons" />
        <Stat label="PT · Dates" value="Manage" icon={Calendar} to="/admin/private-tour/dates" />
        <Stat label="PT · Included" value="Manage" icon={ListChecks} to="/admin/private-tour/included" />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/tours?new=1" className="px-3 py-2 rounded-md bg-gold text-black text-sm hover:bg-gold-dark min-h-[44px] inline-flex items-center">+ New Tour</Link>
            <Link to="/admin/properties" className="px-3 py-2 rounded-md border border-gold text-gold text-sm hover:bg-gold hover:text-black min-h-[44px] inline-flex items-center">+ Manage Properties</Link>
            <Link to="/admin/assets" className="px-3 py-2 rounded-md border border-gold text-gold text-sm hover:bg-gold hover:text-black min-h-[44px] inline-flex items-center">Manage Assets</Link>
          </div>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gold mb-3">Tip</h2>
          <p className="text-sm text-gray-400">All tour content on the public site is database-driven. Published tours appear instantly on the Tours page.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;