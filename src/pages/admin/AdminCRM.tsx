import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { useCrmLeads, useUpsertCrmMetadata } from "@/hooks/useCrm";
import {
  CRM_STATUSES,
  SOURCE_LABELS,
  STATUS_LABELS,
  statusColor,
  type CrmSource,
  type CrmStatus,
} from "@/lib/crm";

type View = "list" | "pipeline";

const AdminCRM = () => {
  const { data, isLoading } = useCrmLeads();
  const upsert = useUpsertCrmMetadata();
  const [view, setView] = useState<View>("list");
  const [source, setSource] = useState<"all" | CrmSource>("all");
  const [status, setStatus] = useState<"all" | CrmStatus>("all");
  const [tag, setTag] = useState<string>("");
  const [search, setSearch] = useState("");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach((l) => l.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((l) => {
      if (source !== "all" && l.source !== source) return false;
      if (status !== "all" && l.status !== status) return false;
      if (tag && !l.tags.includes(tag)) return false;
      if (q && !`${l.name} ${l.email} ${l.phone ?? ""} ${l.country ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, source, status, tag, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: filtered.length };
    for (const s of CRM_STATUSES) c[s] = 0;
    filtered.forEach((l) => { c[l.status] = (c[l.status] ?? 0) + 1; });
    return c;
  }, [filtered]);

  const onChangeStatus = (lead: { source: CrmSource; id: string }, next: CrmStatus) => {
    upsert.mutate({ source: lead.source, source_id: lead.id, status: next });
  };

  const onDrop = (next: CrmStatus) => (e: React.DragEvent) => {
    e.preventDefault();
    const payload = e.dataTransfer.getData("application/json");
    if (!payload) return;
    try {
      const { source, id } = JSON.parse(payload);
      onChangeStatus({ source, id }, next);
    } catch {}
  };

  return (
    <>
      <AdminPageMeta
        title="CRM"
        description="Unified pipeline for every lead across waitlist, custom quotes, and contact form."
      />
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md border border-gray-800 overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 text-xs ${view === "list" ? "bg-gold text-black" : "text-gray-300 hover:text-gold"}`}
          >
            List
          </button>
          <button
            onClick={() => setView("pipeline")}
            className={`px-3 py-2 text-xs border-l border-gray-800 ${view === "pipeline" ? "bg-gold text-black" : "text-gray-300 hover:text-gold"}`}
          >
            Pipeline
          </button>
        </div>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[
          { label: "Total", v: counts.total },
          { label: "New", v: counts.new },
          { label: "Qualified", v: counts.qualified },
          { label: "Tour Booked", v: counts.tour_booked },
          { label: "Closed Won", v: counts.closed_won },
        ].map((k) => (
          <div key={k.label} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">{k.label}</p>
            <p className="text-xl font-light text-white mt-1">{k.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="search"
          placeholder="Search name, email, phone, country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 min-h-[40px]"
        />
        <select value={source} onChange={(e) => setSource(e.target.value as any)} className="bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white min-h-[40px]">
          <option value="all">All sources</option>
          {(["waitlist","quote","contact"] as const).map(s => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white min-h-[40px]">
          <option value="all">All statuses</option>
          {CRM_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} className="bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white min-h-[40px]">
          <option value="">All tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : view === "list" ? (
        <ListView leads={filtered} onChangeStatus={onChangeStatus} />
      ) : (
        <PipelineView leads={filtered} onDrop={onDrop} />
      )}
    </>
  );
};

const ListView = ({
  leads,
  onChangeStatus,
}: {
  leads: ReturnType<typeof useCrmLeads>["data"] extends infer T ? (T extends Array<infer U> ? U[] : never) : never;
  onChangeStatus: (l: { source: any; id: string }, s: CrmStatus) => void;
}) => {
  if (!leads || leads.length === 0)
    return <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">No leads match the current filters.</div>;

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-x-auto">
      <table className="w-full text-sm min-w-[800px]">
        <thead className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Source</th>
            <th className="text-left px-4 py-3">Tags</th>
            <th className="text-left px-4 py-3">Owner</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-right px-4 py-3">Open</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={`${l.source}-${l.id}`} className="border-t border-gray-800 hover:bg-gray-900/50">
              <td className="px-4 py-3 text-white">{l.name}</td>
              <td className="px-4 py-3 text-gray-300">{l.email}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{SOURCE_LABELS[l.source]}</td>
              <td className="px-4 py-3 text-xs text-gray-400">
                {l.tags.length ? l.tags.slice(0,3).map(t => (
                  <span key={t} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">{t}</span>
                )) : "—"}
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">{l.assignedTo ?? "Unassigned"}</td>
              <td className="px-4 py-3">
                <select
                  value={l.status}
                  onChange={(e) => onChangeStatus({ source: l.source, id: l.id }, e.target.value as CrmStatus)}
                  className={`text-xs rounded-md border px-2 py-1 bg-gray-900 ${statusColor(l.status)}`}
                >
                  {CRM_STATUSES.map(s => <option key={s} value={s} className="bg-gray-900 text-white">{STATUS_LABELS[s]}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <Link to={`/admin/crm/${l.source}/${l.id}`} className="text-gold hover:underline text-xs">Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PipelineView = ({
  leads,
  onDrop,
}: {
  leads: any[];
  onDrop: (s: CrmStatus) => (e: React.DragEvent) => void;
}) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {CRM_STATUSES.map((s) => {
          const items = leads.filter((l) => l.status === s);
          return (
            <div
              key={s}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop(s)}
              className="w-72 flex-shrink-0 bg-gray-950 border border-gray-800 rounded-lg flex flex-col"
            >
              <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-gray-400">{STATUS_LABELS[s]}</p>
                <span className="text-xs text-gray-500">{items.length}</span>
              </div>
              <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                {items.map((l) => (
                  <Link
                    key={`${l.source}-${l.id}`}
                    to={`/admin/crm/${l.source}/${l.id}`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify({ source: l.source, id: l.id }))}
                    className="block bg-gray-900 border border-gray-800 rounded-md p-2 hover:border-gold/40 cursor-grab active:cursor-grabbing"
                  >
                    <p className="text-sm text-white truncate">{l.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{l.email}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="text-[10px] text-gray-500">{SOURCE_LABELS[l.source as CrmSource]}</span>
                      {l.tags.slice(0,2).map((t: string) => (
                        <span key={t} className="text-[10px] px-1 rounded bg-gold/10 text-gold border border-gold/30">{t}</span>
                      ))}
                    </div>
                  </Link>
                ))}
                {items.length === 0 && <p className="text-[11px] text-gray-600 text-center py-4">Empty</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCRM;