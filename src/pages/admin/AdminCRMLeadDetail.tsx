import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import {
  useAddCrmNote,
  useCrmLead,
  useCrmNotes,
  useUpsertCrmMetadata,
  useCrmTasksForLead,
  useCreateCrmTask,
  useUpdateCrmTask,
  useDeleteCrmTask,
  useEmailHistoryForRecipient,
  type CrmTask,
  type TaskPriority,
} from "@/hooks/useCrm";
import {
  CRM_STATUSES,
  JOURNEY_LABELS,
  JOURNEY_STAGES,
  SOURCE_LABELS,
  STATUS_LABELS,
  statusColor,
  type CrmSource,
  type CrmStatus,
  type JourneyStage,
} from "@/lib/crm";

const SUGGESTED_TAGS = ["Portugal", "Cabo Verde", "High Priority", "Investor", "Diaspora", "Buyer", "Seller"];
const ADMIN_OWNERS = ["ismael@kingsncompany.com", "joey@kingsncompany.com"];

const AdminCRMLeadDetail = () => {
  const { source, id } = useParams<{ source: CrmSource; id: string }>();
  const { supabaseUser } = useAdmin();
  const { lead, isLoading } = useCrmLead(source, id);
  const notesQ = useCrmNotes(source, id);
  const upsert = useUpsertCrmMetadata();
  const addNote = useAddCrmNote();
  const tasksQ = useCrmTasksForLead(source, id);
  const createTask = useCreateCrmTask();
  const updateTask = useUpdateCrmTask();
  const deleteTask = useDeleteCrmTask();
  const emailsQ = useEmailHistoryForRecipient(lead?.email);
  const [noteBody, setNoteBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("normal");

  if (isLoading) return <AdminLayout title="Lead"><p className="text-gray-400">Loading…</p></AdminLayout>;
  if (!lead) return (
    <AdminLayout title="Lead not found">
      <Link to="/admin/crm" className="text-gold hover:underline">← Back to CRM</Link>
    </AdminLayout>
  );

  const update = (patch: Partial<{ status: CrmStatus; assigned_to_email: string | null; tags: string[]; lead_score: number; country: string | null; last_contact_at: string | null }>) => {
    upsert.mutate({ source: lead.source, source_id: lead.id, ...patch });
  };

  const addTag = (t: string) => {
    const v = t.trim();
    if (!v || lead.tags.includes(v)) return;
    update({ tags: [...lead.tags, v] });
    setTagInput("");
  };
  const removeTag = (t: string) => update({ tags: lead.tags.filter((x) => x !== t) });

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const body = noteBody.trim();
    if (!body || !supabaseUser?.email) return;
    addNote.mutate(
      { source: lead.source, source_id: lead.id, body, author_email: supabaseUser.email },
      { onSuccess: () => { setNoteBody(""); update({ last_contact_at: new Date().toISOString() }); } },
    );
  };

  return (
    <AdminLayout
      title={lead.name}
      description={`${SOURCE_LABELS[lead.source]} · ${lead.email}`}
      actions={<Link to="/admin/crm" className="text-xs text-gold hover:underline">← All leads</Link>}
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: profile */}
        <div className="space-y-4">
          <Card title="Contact">
            <Row label="Name" value={lead.name} />
            <Row label="Email" value={lead.email} />
            <Row label="Phone" value={lead.phone || "—"} />
            <Row label="Country">
              <input
                defaultValue={lead.country ?? ""}
                onBlur={(e) => update({ country: e.target.value || null })}
                className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white w-full"
                placeholder="—"
              />
            </Row>
            <Row label="Source" value={SOURCE_LABELS[lead.source]} />
            <Row label="Created" value={new Date(lead.createdAt).toLocaleString()} />
            <Row label="Last contact" value={lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleString() : "—"} />
          </Card>

          <Card title="Pipeline">
            <Row label="Status">
              <select
                value={lead.status}
                onChange={(e) => update({ status: e.target.value as CrmStatus })}
                className={`text-xs rounded-md border px-2 py-1 bg-gray-900 w-full ${statusColor(lead.status)}`}
              >
                {CRM_STATUSES.map((s) => <option key={s} value={s} className="bg-gray-900 text-white">{STATUS_LABELS[s]}</option>)}
              </select>
            </Row>
            <Row label="Owner">
              <select
                value={lead.assignedTo ?? ""}
                onChange={(e) => update({ assigned_to_email: e.target.value || null })}
                className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white w-full"
              >
                <option value="">Unassigned</option>
                {ADMIN_OWNERS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Row>
            <Row label="Lead score">
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={lead.leadScore}
                onBlur={(e) => update({ lead_score: Number(e.target.value) || 0 })}
                className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white w-full"
              />
            </Row>
          </Card>

          <Card title="Tags">
            <div className="flex flex-wrap gap-1 mb-2">
              {lead.tags.length === 0 && <span className="text-xs text-gray-500">No tags yet</span>}
              {lead.tags.map((t) => (
                <button key={t} onClick={() => removeTag(t)} className="text-[11px] px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300">
                  {t} ✕
                </button>
              ))}
            </div>
            <div className="flex gap-1 mb-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag…" className="flex-1 bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white" />
              <button onClick={() => addTag(tagInput)} className="text-xs px-3 py-1 bg-gold text-black rounded hover:opacity-90">Add</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.filter((t) => !lead.tags.includes(t)).map((t) => (
                <button key={t} onClick={() => addTag(t)} className="text-[10px] px-2 py-0.5 rounded border border-gray-700 text-gray-400 hover:text-gold hover:border-gold/40">+ {t}</button>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle: notes + journey */}
        <div className="space-y-4">
          <Card title="Notes">
            <form onSubmit={submitNote} className="space-y-2 mb-3">
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Internal note…"
                className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-2 text-sm text-white min-h-[80px]"
              />
              <button type="submit" disabled={!noteBody.trim()} className="text-xs px-3 py-1.5 bg-gold text-black rounded hover:opacity-90 disabled:opacity-40">Add note</button>
            </form>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {(notesQ.data ?? []).map((n) => (
                <div key={n.id} className="bg-gray-900 border border-gray-800 rounded p-2">
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{n.body}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{n.author_email} · {new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))}
              {(notesQ.data ?? []).length === 0 && <p className="text-xs text-gray-500">No notes yet.</p>}
            </div>
          </Card>

          <Card title="Investor Journey">
            <ol className="space-y-1">
              {JOURNEY_STAGES.map((s, i) => {
                const reached = stageReached(s, lead.status);
                return (
                  <li key={s} className={`flex items-center gap-2 text-xs ${reached ? "text-gold" : "text-gray-500"}`}>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${reached ? "border-gold bg-gold/10" : "border-gray-700"}`}>{i+1}</span>
                    <span>{JOURNEY_LABELS[s as JourneyStage]}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        {/* Right: original submission */}
        <div className="space-y-4">
          <Card title="Original submission">
            {lead.subject && <Row label="Subject" value={lead.subject} />}
            {lead.message && (
              <div className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-900 border border-gray-800 rounded p-2 mt-2">{lead.message}</div>
            )}
            <Row label="Raw status" value={lead.rawStatus} />
            <div className="mt-3">
              <Link to={sourceListLink(lead.source)} className="text-xs text-gold hover:underline">Open in {SOURCE_LABELS[lead.source]} →</Link>
            </div>
          </Card>

          <Card title="Tasks">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = newTaskTitle.trim();
                if (!title) return;
                createTask.mutate(
                  {
                    source: lead.source,
                    source_id: lead.id,
                    title,
                    due_date: newTaskDue ? new Date(newTaskDue).toISOString() : null,
                    priority: newTaskPriority,
                    assigned_to_email: lead.assignedTo,
                    created_by_email: supabaseUser?.email ?? null,
                  },
                  { onSuccess: () => { setNewTaskTitle(""); setNewTaskDue(""); setNewTaskPriority("normal"); } },
                );
              }}
              className="space-y-2 mb-3"
            >
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task…"
                className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-sm text-white"
              />
              <div className="flex gap-1">
                <input
                  type="datetime-local"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-white"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                  className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-white"
                >
                  <option value="low">low</option>
                  <option value="normal">normal</option>
                  <option value="high">high</option>
                  <option value="urgent">urgent</option>
                </select>
                <button type="submit" disabled={!newTaskTitle.trim()} className="text-xs px-3 py-1 bg-gold text-black rounded hover:opacity-90 disabled:opacity-40">Add</button>
              </div>
            </form>
            <ul className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {(tasksQ.data ?? []).map((t: CrmTask) => (
                <li key={t.id} className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded p-2">
                  <input
                    type="checkbox"
                    checked={t.status === "done"}
                    onChange={(e) => updateTask.mutate({ id: t.id, patch: { status: e.target.checked ? "done" : "open", completed_at: e.target.checked ? new Date().toISOString() : null } })}
                    className="mt-1 accent-gold"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === "done" ? "line-through text-gray-500" : "text-white"}`}>{t.title}</p>
                    <p className="text-[10px] text-gray-500">
                      {t.due_date ? new Date(t.due_date).toLocaleString() : "No due date"} · {t.priority}
                    </p>
                  </div>
                  <button onClick={() => { if (confirm("Delete?")) deleteTask.mutate(t.id); }} className="text-gray-600 hover:text-red-400 text-[10px]">✕</button>
                </li>
              ))}
              {(tasksQ.data ?? []).length === 0 && <p className="text-xs text-gray-500">No tasks yet.</p>}
            </ul>
          </Card>

          <Card title="Email history">
            {emailsQ.isLoading ? (
              <p className="text-xs text-gray-500">Loading…</p>
            ) : !emailsQ.data?.available ? (
              <p className="text-xs text-gray-500">Email tracking will appear here once email infrastructure is enabled.</p>
            ) : emailsQ.data.entries.length === 0 ? (
              <p className="text-xs text-gray-500">No emails sent to {lead.email} yet.</p>
            ) : (
              <ul className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {emailsQ.data.entries.map((e) => (
                  <li key={e.id} className="bg-gray-900 border border-gray-800 rounded p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-white truncate">{e.template_name ?? "email"}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        e.status === "sent" ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" :
                        e.status === "dlq" || e.status === "failed" || e.status === "bounced" ? "border-red-500/40 text-red-300 bg-red-500/10" :
                        e.status === "suppressed" ? "border-amber-500/40 text-amber-300 bg-amber-500/10" :
                        "border-gray-700 text-gray-400"
                      }`}>{e.status ?? "—"}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(e.created_at).toLocaleString()}</p>
                    {e.error_message && <p className="text-[10px] text-red-400 mt-1 line-clamp-2">{e.error_message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

const stageReached = (stage: JourneyStage, status: CrmStatus): boolean => {
  const order: Record<CrmStatus, number> = {
    new: 0,
    contacted: 0,
    discovery_scheduled: 1,
    discovery_completed: 1,
    qualified: 2,
    proposal_sent: 2,
    tour_booked: 2,
    closed_won: 7,
    closed_lost: 0,
  };
  const stageIdx: Record<JourneyStage, number> = {
    lead: 0,
    discovery_call: 1,
    tour_booked: 2,
    tour_attended: 3,
    properties_reviewed: 4,
    property_shortlisted: 5,
    offer_submitted: 6,
    property_purchased: 7,
  };
  return stageIdx[stage] <= order[status];
};

const sourceListLink = (s: CrmSource) =>
  s === "waitlist" ? "/admin/waitlist" : s === "quote" ? "/admin/quotes" : "/admin/crm";

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-gray-950 border border-gray-800 rounded-lg p-4">
    <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">{title}</h2>
    {children}
  </section>
);

const Row = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-900 last:border-0">
    <span className="text-[11px] uppercase tracking-widest text-gray-500 w-24 flex-shrink-0">{label}</span>
    <div className="flex-1 text-right text-sm text-gray-200">
      {children ?? value}
    </div>
  </div>
);

export default AdminCRMLeadDetail;