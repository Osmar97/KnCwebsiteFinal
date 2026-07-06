import { useEffect, useState } from "react";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchTourDestinationsAdmin, upsertTourDestination, deleteTourDestination } from "@/data/privateTour";

type Row = {
  id?: string;
  slug: string;
  flag: string;
  min_days: number;
  max_days: number;
  min_guests: number;
  max_guests: number;
  base_price_per_day_per_person: number;
  currency: string;
  sort_order: number;
  active: boolean;
  label_en: string; label_pt: string; label_fr: string;
  desc_en: string;  desc_pt: string;  desc_fr: string;
};

const blank = (): Row => ({
  slug: "", flag: "", min_days: 3, max_days: 7, min_guests: 1, max_guests: 10,
  base_price_per_day_per_person: 1900, currency: "EUR", sort_order: 0, active: true,
  label_en: "", label_pt: "", label_fr: "", desc_en: "", desc_pt: "", desc_fr: "",
});

const AdminPrivateTourDestinations = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTourDestinationsAdmin();
      setRows(data as any);
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const save = async (row: Row) => {
    try {
      await upsertTourDestination(row as any);
      toast({ title: "Saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const remove = async (row: Row) => {
    if (!row.id) return setRows((r) => r.filter((x) => x !== row));
    if (!confirm(`Delete destination "${row.label_en}"?`)) return;
    try {
      await deleteTourDestination(row.id);
      toast({ title: "Deleted" });
      load();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <AdminPageMeta title="Private Tour · Destinations" description="Manage destinations shown in the WHERE WE GO section and the booking flow." />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setRows((r) => [...r, blank()])} className="bg-gold hover:bg-gold-dark text-black">
          <Plus className="w-4 h-4 mr-1" /> New destination
        </Button>
      </div>
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="grid gap-4">
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">{r.flag || "🏳️"}</span>
                <Input value={r.label_en} placeholder="Label (EN)" onChange={(e) => update(i, { label_en: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                <Input value={r.slug} placeholder="slug" onChange={(e) => update(i, { slug: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                <div className="flex items-center gap-2 ml-auto">
                  <Label className="text-xs text-gray-400">Active</Label>
                  <Switch checked={r.active} onCheckedChange={(v) => update(i, { active: v })} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><Label>Flag emoji</Label><Input value={r.flag} onChange={(e) => update(i, { flag: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Sort order</Label><Input type="number" value={r.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Currency</Label><Input value={r.currency} maxLength={3} onChange={(e) => update(i, { currency: e.target.value.toUpperCase() })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Price / day / person</Label><Input type="number" step="50" value={r.base_price_per_day_per_person} onChange={(e) => update(i, { base_price_per_day_per_person: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Min days</Label><Input type="number" value={r.min_days} onChange={(e) => update(i, { min_days: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Max days</Label><Input type="number" value={r.max_days} onChange={(e) => update(i, { max_days: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Min guests</Label><Input type="number" value={r.min_guests} onChange={(e) => update(i, { min_guests: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Max guests</Label><Input type="number" value={r.max_guests} onChange={(e) => update(i, { max_guests: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["en", "pt", "fr"] as const).map((l) => (
                  <div key={l}>
                    <Label>Description ({l.toUpperCase()})</Label>
                    <Textarea rows={2} value={(r as any)[`desc_${l}`]} onChange={(e) => update(i, { [`desc_${l}`]: e.target.value } as any)} className="bg-gray-900 border-gray-800 text-white" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["en", "pt", "fr"] as const).map((l) => l !== "en" && (
                  <div key={l}><Label>Label ({l.toUpperCase()})</Label><Input value={(r as any)[`label_${l}`]} onChange={(e) => update(i, { [`label_${l}`]: e.target.value } as any)} className="bg-gray-900 border-gray-800 text-white" /></div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save(r)} className="bg-gold hover:bg-gold-dark text-black"><Save className="w-4 h-4 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={() => remove(r)} className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminPrivateTourDestinations;