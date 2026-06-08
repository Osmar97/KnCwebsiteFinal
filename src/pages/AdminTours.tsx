import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Copy, Archive, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TourEditor from "@/components/admin/TourEditor";
import { formatPrice } from "@/lib/formatPrice";
import type { Tables } from "@/integrations/supabase/types";

type TourWithDates = Tables<"tours"> & {
  tour_dates: Tables<"tour_dates">[];
};

const STATUSES = ["all", "published", "draft", "archived"] as const;

const AdminTours = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingId("new");
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: tours, isLoading } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*, tour_dates(*)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as TourWithDates[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-tours"] });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tours").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => { invalidate(); toast({ title: `Tour ${v.status}` }); },
    onError: (e: Error) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const deleteTour = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tours").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: "Tour deleted" }); },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  const duplicateTour = useMutation({
    mutationFn: async (id: string) => {
      const src = tours?.find((t) => t.id === id);
      if (!src) throw new Error("Source tour not found");
      const { id: _i, created_at: _c, updated_at: _u, tour_dates: _d, ...rest } = src;
      const insert = {
        ...rest,
        slug: `${src.slug}-copy-${Date.now().toString(36)}`,
        name_en: `${src.name_en} (Copy)`,
        status: "draft",
      };
      const { error } = await supabase.from("tours").insert(insert);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: "Tour duplicated" }); },
    onError: (e: Error) => toast({ title: "Duplicate failed", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    let list = tours ?? [];
    if (filter !== "all") list = list.filter((t) => t.status === filter);
    const s = search.trim().toLowerCase();
    if (s) list = list.filter((t) => `${t.name_en} ${t.slug} ${t.category}`.toLowerCase().includes(s));
    return list;
  }, [tours, filter, search]);

  if (editingId !== null) {
    return (
      <AdminLayout title={editingId === "new" ? "New Tour" : "Edit Tour"} description="Manage tour content, dates, pricing and images.">
        <TourEditor
          tourId={editingId === "new" ? null : editingId}
          onClose={() => { setEditingId(null); invalidate(); }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manage Tours"
      description="Create, edit, publish and archive tours. Changes appear live on the public site."
      actions={
        <Button onClick={() => setEditingId("new")} className="bg-gold hover:bg-gold-dark text-black min-h-[44px]">
          <Plus className="w-4 h-4 mr-1" /> New Tour
        </Button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input
          placeholder="Search tours…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-950 border-gray-800 text-white"
        />
        <div className="flex gap-1 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-md text-xs uppercase tracking-wider min-h-[40px] whitespace-nowrap ${
                filter === s ? "bg-gold text-black" : "bg-gray-900 text-gray-300 hover:text-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
          No tours found.
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-gray-950 border border-gray-800 hover:border-gold/50 rounded-lg p-4 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40 h-32 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
                  {t.hero_image ? (
                    <img src={t.hero_image} alt={t.name_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white">{t.name_en}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                      t.status === "published" ? "bg-emerald-500/15 text-emerald-400" :
                      t.status === "archived" ? "bg-gray-700 text-gray-300" : "bg-amber-500/15 text-amber-400"
                    }`}>{t.status}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gold/10 text-gold uppercase tracking-wider">{t.tour_type}</span>
                  </div>
                  <p className="text-sm text-gray-400 break-words">{t.short_desc_en}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    <span>{(t.destinations ?? []).join(", ") || "—"}</span>
                    <span>{t.duration_days} days</span>
                    <span>From {formatPrice(t.base_price)}</span>
                    <span>{t.tour_dates?.length ?? 0} dates</span>
                  </div>
                </div>
                <div className="flex sm:flex-col flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black min-h-[40px]" onClick={() => setEditingId(t.id)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800 min-h-[40px]" onClick={() => duplicateTour.mutate(t.id)}>
                    <Copy className="w-4 h-4 mr-1" /> Duplicate
                  </Button>
                  {t.status !== "published" ? (
                    <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black min-h-[40px]" onClick={() => updateStatus.mutate({ id: t.id, status: "published" })}>
                      <Eye className="w-4 h-4 mr-1" /> Publish
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black min-h-[40px]" onClick={() => updateStatus.mutate({ id: t.id, status: "draft" })}>
                      <EyeOff className="w-4 h-4 mr-1" /> Unpublish
                    </Button>
                  )}
                  {t.status !== "archived" && (
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 min-h-[40px]" onClick={() => updateStatus.mutate({ id: t.id, status: "archived" })}>
                      <Archive className="w-4 h-4 mr-1" /> Archive
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white min-h-[40px]"
                    onClick={() => { if (confirm("Delete this tour permanently? This also deletes its dates.")) deleteTour.mutate(t.id); }}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTours;