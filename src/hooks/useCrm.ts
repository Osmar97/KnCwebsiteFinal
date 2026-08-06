import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CrmSource, CrmStatus } from "@/lib/crm";

export interface CrmLead {
  id: string; // source_id (uuid)
  source: CrmSource;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  subject: string | null;
  message: string | null;
  createdAt: string;
  rawStatus: string;
  // crm metadata (joined)
  metadataId: string | null;
  status: CrmStatus;
  assignedTo: string | null;
  tags: string[];
  leadScore: number;
  lastContactAt: string | null;
}

export const useCrmLeads = () =>
  useQuery({
    queryKey: ["crm-leads"],
    queryFn: async (): Promise<CrmLead[]> => {
      const [waitlist, quotes, contacts, meta] = await Promise.all([
        supabase
          .from("tour_waitlist_requests")
          .select("id,full_name,email,phone,country,status,created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
        supabase
          .from("tour_custom_quote_requests")
          .select("id,first_name,last_name,email,phone,nationality,status,notes,created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
        supabase
          .from("contact_submissions")
          .select("id,name,email,subject,message,status,created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
        supabase.from("crm_lead_metadata").select("*"),
      ]);
      if (waitlist.error) throw waitlist.error;
      if (quotes.error) throw quotes.error;
      if (contacts.error) throw contacts.error;
      if (meta.error) throw meta.error;

      const metaMap = new Map<string, any>();
      for (const m of meta.data ?? []) metaMap.set(`${m.source}:${m.source_id}`, m);

      const apply = (source: CrmSource, id: string, base: Omit<CrmLead, "metadataId" | "status" | "assignedTo" | "tags" | "leadScore" | "lastContactAt">): CrmLead => {
        const m = metaMap.get(`${source}:${id}`);
        return {
          ...base,
          metadataId: m?.id ?? null,
          status: (m?.status as CrmStatus) ?? "new",
          assignedTo: m?.assigned_to_email ?? null,
          tags: m?.tags ?? [],
          leadScore: m?.lead_score ?? 0,
          lastContactAt: m?.last_contact_at ?? null,
          country: m?.country ?? base.country,
        };
      };

      const w: CrmLead[] = (waitlist.data ?? []).map((r: any) =>
        apply("waitlist", r.id, {
          id: r.id,
          source: "waitlist",
          name: r.full_name ?? "—",
          email: r.email ?? "",
          phone: r.phone ?? null,
          country: r.country ?? null,
          subject: null,
          message: null,
          createdAt: r.created_at,
          rawStatus: r.status ?? "new",
        }),
      );
      const q: CrmLead[] = (quotes.data ?? []).map((r: any) =>
        apply("quote", r.id, {
          id: r.id,
          source: "quote",
          name: [r.first_name, r.last_name].filter(Boolean).join(" ") || "—",
          email: r.email ?? "",
          phone: r.phone ?? null,
          country: r.nationality ?? null,
          subject: null,
          message: r.notes ?? null,
          createdAt: r.created_at,
          rawStatus: r.status ?? "new",
        }),
      );
      const c: CrmLead[] = (contacts.data ?? []).map((r: any) =>
        apply("contact", r.id, {
          id: r.id,
          source: "contact",
          name: r.name ?? "—",
          email: r.email ?? "",
          phone: null,
          country: null,
          subject: r.subject ?? null,
          message: r.message ?? null,
          createdAt: r.created_at,
          rawStatus: r.status ?? "new",
        }),
      );

      return [...w, ...q, ...c].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },
  });

export const useCrmLead = (source: CrmSource | undefined, id: string | undefined) => {
  const { data, ...rest } = useCrmLeads();
  const lead = data?.find((l) => l.source === source && l.id === id) ?? null;
  return { lead, ...rest };
};

export interface UpsertMetadataInput {
  source: CrmSource;
  source_id: string;
  status?: CrmStatus;
  assigned_to_email?: string | null;
  tags?: string[];
  lead_score?: number;
  country?: string | null;
  last_contact_at?: string | null;
}

export const useUpsertCrmMetadata = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpsertMetadataInput) => {
      const { error } = await supabase
        .from("crm_lead_metadata")
        .upsert(input, { onConflict: "source,source_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-leads"] });
    },
  });
};

export interface CrmNote {
  id: string;
  source: CrmSource;
  source_id: string;
  author_email: string;
  body: string;
  created_at: string;
}

export const useCrmNotes = (source: CrmSource | undefined, id: string | undefined) =>
  useQuery({
    queryKey: ["crm-notes", source, id],
    enabled: !!source && !!id,
    queryFn: async (): Promise<CrmNote[]> => {
      const { data, error } = await supabase
        .from("crm_notes")
        .select("*")
        .eq("source", source!)
        .eq("source_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CrmNote[];
    },
  });

export const useAddCrmNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { source: CrmSource; source_id: string; body: string; author_email: string }) => {
      const { error } = await supabase.from("crm_notes").insert(input);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-notes", vars.source, vars.source_id] });
    },
  });
};

// ============ Tasks ============

export type TaskStatus = "open" | "in_progress" | "done" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";

export interface CrmTask {
  id: string;
  source: CrmSource;
  source_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  assigned_to_email: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_by_email: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useCrmTasksForLead = (source: CrmSource | undefined, id: string | undefined) =>
  useQuery({
    queryKey: ["crm-tasks", source, id],
    enabled: !!source && !!id,
    queryFn: async (): Promise<CrmTask[]> => {
      const { data, error } = await supabase
        .from("crm_tasks")
        .select("*")
        .eq("source", source!)
        .eq("source_id", id!)
        .order("status", { ascending: true })
        .order("due_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as CrmTask[];
    },
  });

export const useAllCrmTasks = (opts?: { assignedTo?: string | null; statuses?: TaskStatus[] }) =>
  useQuery({
    queryKey: ["crm-tasks-all", opts?.assignedTo ?? "*", (opts?.statuses ?? []).join(",")],
    queryFn: async (): Promise<CrmTask[]> => {
      let q = supabase.from("crm_tasks").select("*").order("due_date", { ascending: true, nullsFirst: false }).limit(500);
      if (opts?.assignedTo) q = q.eq("assigned_to_email", opts.assignedTo);
      if (opts?.statuses?.length) q = q.in("status", opts.statuses);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CrmTask[];
    },
  });

export const useCreateCrmTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<CrmTask> & { source: CrmSource; source_id: string; title: string }) => {
      const { error } = await supabase.from("crm_tasks").insert(input as any);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["crm-tasks", vars.source, vars.source_id] });
      qc.invalidateQueries({ queryKey: ["crm-tasks-all"] });
    },
  });
};

export const useUpdateCrmTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<CrmTask> }) => {
      const { error } = await supabase.from("crm_tasks").update(patch as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-tasks"] });
      qc.invalidateQueries({ queryKey: ["crm-tasks-all"] });
    },
  });
};

export const useDeleteCrmTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-tasks"] });
      qc.invalidateQueries({ queryKey: ["crm-tasks-all"] });
    },
  });
};

// ============ Email history ============
// Reads from email_send_log (if email infrastructure is enabled). Gracefully
// returns an empty list when the table is absent so the UI does not break.

export interface EmailHistoryEntry {
  id: string;
  message_id: string | null;
  template_name: string | null;
  status: string | null;
  error_message: string | null;
  created_at: string;
}

export const useEmailHistoryForRecipient = (email: string | undefined) =>
  useQuery({
    queryKey: ["email-history", email],
    enabled: !!email,
    queryFn: async (): Promise<{ entries: EmailHistoryEntry[]; available: boolean }> => {
      const { data, error } = await (supabase as any)
        .from("email_send_log")
        .select("id, message_id, template_name, status, error_message, created_at")
        .eq("recipient_email", email)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) {
        // Table not found / no email infra → treat as unavailable, not a hard error.
        if ((error as any)?.code === "PGRST205" || /relation .* does not exist/i.test(error.message)) {
          return { entries: [], available: false };
        }
        throw error;
      }
      // Dedupe by message_id (latest per message_id)
      const seen = new Set<string>();
      const entries: EmailHistoryEntry[] = [];
      for (const r of (data ?? []) as EmailHistoryEntry[]) {
        const key = r.message_id ?? r.id;
        if (seen.has(key)) continue;
        seen.add(key);
        entries.push(r);
      }
      return { entries, available: true };
    },
  });