import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { useAllCrmTasks, useUpdateCrmTask, useDeleteCrmTask, type CrmTask, type TaskStatus } from "@/hooks/useCrm";
import { SOURCE_LABELS } from "@/lib/crm";
import { CheckCircle2, Circle, Clock, AlertTriangle, Trash2 } from "lucide-react";

const ADMIN_OWNERS = ["ismael@kingsncompany.com", "joey@kingsncompany.com"];
const STATUSES: TaskStatus[] = ["open", "in_progress", "done", "cancelled"];

const priorityClass = (p: string) =>
  p === "urgent" ? "text-red-300 border-red-500/40 bg-red-500/10" :
  p === "high" ? "text-amber-300 border-amber-500/40 bg-amber-500/10" :
  p === "low" ? "text-gray-400 border-gray-700 bg-gray-900" :
  "text-blue-300 border-blue-500/30 bg-blue-500/10";

const overdue = (t: CrmTask) =>
  t.status !== "done" && t.status !== "cancelled" && t.due_date && new Date(t.due_date) < new Date();

const AdminCRMTasks = () => {
  const { supabaseUser } = useAdmin();
  const [scope, setScope] = useState<"all" | "mine">("mine");
  const [statusFilter, setStatusFilter] = useState<"open" | "all">("open");

  const me = supabaseUser?.email ?? null;
  const tasksQ = useAllCrmTasks({
    assignedTo: scope === "mine" ? me : null,
    statuses: statusFilter === "open" ? ["open", "in_progress"] : undefined,
  });
  const update = useUpdateCrmTask();
  const del = useDeleteCrmTask();

  const tasks = tasksQ.data ?? [];

  const grouped = useMemo(() => {
    const out: Record<string, CrmTask[]> = { Overdue: [], Today: [], Upcoming: [], "No due date": [], Done: [] };
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    for (const t of tasks) {
      if (t.status === "done" || t.status === "cancelled") { out.Done.push(t); continue; }
      if (!t.due_date) { out["No due date"].push(t); continue; }
      const d = new Date(t.due_date);
      if (d < today) out.Overdue.push(t);
      else if (d < tomorrow) out.Today.push(t);
      else out.Upcoming.push(t);
    }
    return out;
  }, [tasks]);

  const toggleDone = (t: CrmTask) => {
    const done = t.status === "done";
    update.mutate({ id: t.id, patch: { status: done ? "open" : "done", completed_at: done ? null : new Date().toISOString() } });
  };

  return (
    <AdminLayout title="Tasks" description="Follow-ups across all leads.">
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-800">
          <button onClick={() => setScope("mine")} className={`px-3 py-1.5 text-xs ${scope === "mine" ? "bg-gold text-black" : "bg-gray-950 text-gray-300"}`}>My Tasks</button>
          <button onClick={() => setScope("all")} className={`px-3 py-1.5 text-xs ${scope === "all" ? "bg-gold text-black" : "bg-gray-950 text-gray-300"}`}>All</button>
        </div>
        <div className="inline-flex rounded-md overflow-hidden border border-gray-800">
          <button onClick={() => setStatusFilter("open")} className={`px-3 py-1.5 text-xs ${statusFilter === "open" ? "bg-gold text-black" : "bg-gray-950 text-gray-300"}`}>Open</button>
          <button onClick={() => setStatusFilter("all")} className={`px-3 py-1.5 text-xs ${statusFilter === "all" ? "bg-gold text-black" : "bg-gray-950 text-gray-300"}`}>All statuses</button>
        </div>
      </div>

      {tasksQ.isLoading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks. Add tasks from a lead's profile.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([bucket, list]) => list.length > 0 && (
            <section key={bucket}>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                {bucket === "Overdue" && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                {bucket === "Today" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                {bucket} <span className="text-gray-600">({list.length})</span>
              </h3>
              <ul className="space-y-1.5">
                {list.map((t) => (
                  <li key={t.id} className={`group flex items-start gap-3 bg-gray-950 border rounded-md p-3 ${overdue(t) ? "border-red-500/40" : "border-gray-800"}`}>
                    <button onClick={() => toggleDone(t)} className="mt-0.5 text-gold hover:scale-110 transition-transform">
                      {t.status === "done" ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/admin/crm/${t.source}/${t.source_id}`} className={`text-sm ${t.status === "done" ? "line-through text-gray-500" : "text-white"} hover:text-gold`}>
                          {t.title}
                        </Link>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityClass(t.priority)}`}>{t.priority}</span>
                        <span className="text-[10px] text-gray-500">{SOURCE_LABELS[t.source]}</span>
                      </div>
                      {t.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>}
                      <p className="text-[11px] text-gray-500 mt-1">
                        {t.due_date ? `Due ${new Date(t.due_date).toLocaleString()}` : "No due date"}
                        {t.assigned_to_email && ` · ${t.assigned_to_email}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <select
                        value={t.status}
                        onChange={(e) => update.mutate({ id: t.id, patch: { status: e.target.value as TaskStatus } })}
                        className="bg-gray-900 border border-gray-800 rounded px-1.5 py-1 text-[11px] text-gray-200"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                      </select>
                      <select
                        value={t.assigned_to_email ?? ""}
                        onChange={(e) => update.mutate({ id: t.id, patch: { assigned_to_email: e.target.value || null } })}
                        className="bg-gray-900 border border-gray-800 rounded px-1.5 py-1 text-[11px] text-gray-200 hidden md:block"
                      >
                        <option value="">Unassigned</option>
                        {ADMIN_OWNERS.map((o) => <option key={o} value={o}>{o.split("@")[0]}</option>)}
                      </select>
                      <button onClick={() => { if (confirm("Delete this task?")) del.mutate(t.id); }} className="text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCRMTasks;