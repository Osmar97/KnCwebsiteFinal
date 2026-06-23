import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

type LeadSource = "waitlist" | "quote";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: LeadSource;
  sourceLabel: string;
  status: string;
  createdAt: string;
  detailUrl: string;
}

const STATUS_FILTERS = ["all", "new", "contacted", "qualified", "closed"] as const;
const SOURCE_FILTERS = ["all", "waitlist", "quote"] as const;

const statusColor = (s: string) => {
  const v = s.toLowerCase();
  if (["new"].includes(v)) return "bg-blue-500/10 text-blue-300 border-blue-500/30";
  if (["contacted", "in_review", "quoted"].includes(v)) return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  if (["converted", "won", "qualified"].includes(v)) return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  if (["closed", "lost"].includes(v)) return "bg-gray-500/10 text-gray-300 border-gray-500/30";
  return "bg-gray-500/10 text-gray-300 border-gray-500/30";
};

const useLeads = () =>
  useQuery({
    queryKey: ["admin-leads-inbox"],
    queryFn: async (): Promise<Lead[]> => {
      const [waitlistRes, quotesRes] = await Promise.all([
        supabase
          .from("tour_waitlist_requests")
          .select("id, full_name, email, phone, status, created_at")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("tour_custom_quote_requests")
          .select("id, first_name, last_name, email, phone, status, created_at")
          .order("created_at", { ascending: false })
          .limit(500),
      ]);
      if (waitlistRes.error) throw waitlistRes.error;
      if (quotesRes.error) throw quotesRes.error;
      const waitlist: Lead[] = (waitlistRes.data ?? []).map((r: any) => ({
        id: `w-${r.id}`,
        name: r.full_name ?? "—",
        email: r.email ?? "",
        phone: r.phone ?? null,
        source: "waitlist",
        sourceLabel: "Waitlist",
        status: r.status ?? "new",
        createdAt: r.created_at,
        detailUrl: "/admin/waitlist",
      }));
      const quotes: Lead[] = (quotesRes.data ?? []).map((r: any) => ({
        id: `q-${r.id}`,
        name: [r.first_name, r.last_name].filter(Boolean).join(" ") || "—",
        email: r.email ?? "",
        phone: r.phone ?? null,
        source: "quote",
        sourceLabel: "Custom Quote",
        status: r.status ?? "new",
        createdAt: r.created_at,
        detailUrl: "/admin/quotes",
      }));
      return [...waitlist, ...quotes].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },
  });

const AdminLeadsInbox = () => {
  const { data, isLoading } = useLeads();
  const [source, setSource] = useState<(typeof SOURCE_FILTERS)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((l) => {
      if (source !== "all" && l.source !== source) return false;
      if (status !== "all" && l.status.toLowerCase() !== status) return false;
      if (q && !`${l.name} ${l.email} ${l.phone ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, source, status, search]);

  return (
    <AdminLayout
      title="Leads Inbox"
      description="All lead sources in one place — waitlist sign-ups and custom quote requests."
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="search"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 min-h-[40px]"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as any)}
          className="bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white min-h-[40px]"
        >
          {SOURCE_FILTERS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All sources" : s === "waitlist" ? "Waitlist" : "Custom Quote"}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white min-h-[40px]"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
          No leads match the current filters.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-right px-4 py-3">Open</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t border-gray-800 hover:bg-gray-900/50">
                    <td className="px-4 py-3 text-white">{l.name}</td>
                    <td className="px-4 py-3 text-gray-300">{l.email}</td>
                    <td className="px-4 py-3 text-gray-300">{l.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{l.sourceLabel}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md border text-xs ${statusColor(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={l.detailUrl} className="text-gold hover:underline text-xs">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3">
            {filtered.map((l) => (
              <Link
                key={l.id}
                to={l.detailUrl}
                className="block bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gold/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{l.name}</p>
                    <p className="text-xs text-gray-400 truncate">{l.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] ${statusColor(l.status)}`}>
                    {l.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
                  <span>{l.sourceLabel}</span>
                  <span>{l.phone || "no phone"}</span>
                  <span>{new Date(l.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminLeadsInbox;