import { useEffect, useState } from "react";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchTourAddons, upsertTourAddon, deleteTourAddon } from "@/data/privateTour";

type Row = {
  id?: string;
  slug: string; icon: string; price: number;
  is_complimentary: boolean; currency: string;
  sort_order: number; active: boolean;
  label_en: string; label_pt: string; label_fr: string;
  desc_en: string;  desc_pt: string;  desc_fr: string;
  note_en: string;  note_pt: string;  note_fr: string;
};

const blank = (): Row => ({
  slug: "", icon: "✨", price: 0, is_complimentary: false, currency: "EUR",
  sort_order: 0, active: true,
  label_en: "", label_pt: "", label_fr: "",
  desc_en: "", desc_pt: "", desc_fr: "",
  note_en: "", note_pt: "", note_fr: "",
});

const AdminPrivateTourAddons = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTourAddons();
      setRows(data as any);
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (i: number, p: Partial<Row>) => setRows((r) => r.map((row, idx) => idx === i ? { ...row, ...p } : row));

  const save = async (row: Row) => {
    try {
      await upsertTourAddon(row as any);
      toast({ title: "Saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const remove = async (row: Row) => {
    if (!row.id) return setRows((r) => r.filter((x) => x !== row));
    if (!confirm(`Delete "${row.label_en}"?`)) return;
    try {
      await deleteTourAddon(row.id);
      toast({ title: "Deleted" });
      load();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <AdminPageMeta title="Private Tour · Add-Ons" description="Manage optional extras shown in the booking flow." />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setRows((r) => [...r, blank()])} className="bg-gold hover:bg-gold-dark text-black"><Plus className="w-4 h-4 mr-1" />New add-on</Button>
      </div>
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="grid gap-4">
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">{r.icon}</span>
                <Input value={r.label_en} placeholder="Label (EN)" onChange={(e) => update(i, { label_en: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                <Input value={r.slug} placeholder="slug" onChange={(e) => update(i, { slug: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                <div className="flex items-center gap-2 ml-auto">
                  <Label className="text-xs text-gray-400">Active</Label>
                  <Switch checked={r.active} onCheckedChange={(v) => update(i, { active: v })} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><Label>Icon</Label><Input value={r.icon} onChange={(e) => update(i, { icon: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Sort order</Label><Input type="number" value={r.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Price (per person)</Label><Input type="number" step="10" value={r.price} onChange={(e) => update(i, { price: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Currency</Label><Input value={r.currency} maxLength={3} onChange={(e) => update(i, { currency: e.target.value.toUpperCase() })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div className="flex items-end gap-2"><Label className="text-xs text-gray-400">Complimentary</Label><Switch checked={r.is_complimentary} onCheckedChange={(v) => update(i, { is_complimentary: v })} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["en","pt","fr"] as const).map((l) => (
                  <div key={l}><Label>Description ({l.toUpperCase()})</Label><Textarea rows={2} value={(r as any)[`desc_${l}`]} onChange={(e) => update(i, { [`desc_${l}`]: e.target.value } as any)} className="bg-gray-900 border-gray-800 text-white" /></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["en","pt","fr"] as const).map((l) => (
                  <div key={l}><Label>Note ({l.toUpperCase()})</Label><Input value={(r as any)[`note_${l}`]} onChange={(e) => update(i, { [`note_${l}`]: e.target.value } as any)} className="bg-gray-900 border-gray-800 text-white" /></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["pt","fr"] as const).map((l) => (
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

export default AdminPrivateTourAddons;