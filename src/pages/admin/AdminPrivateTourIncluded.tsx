import { useEffect, useState } from "react";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchTourIncludedItems, upsertTourIncludedItem, deleteTourIncludedItem } from "@/data/privateTour";

type Row = {
  id?: string; sort_order: number; active: boolean;
  text_en: string; text_pt: string; text_fr: string;
};

const blank = (): Row => ({ sort_order: 0, active: true, text_en: "", text_pt: "", text_fr: "" });

const AdminPrivateTourIncluded = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTourIncludedItems();
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
      await upsertTourIncludedItem(row as any);
      toast({ title: "Saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const remove = async (row: Row) => {
    if (!row.id) return setRows((r) => r.filter((x) => x !== row));
    if (!confirm("Delete this item?")) return;
    try {
      await deleteTourIncludedItem(row.id);
      toast({ title: "Deleted" });
      load();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <AdminPageMeta title="Private Tour · Included Items" description='Bullet list shown in the "What\u2019s included" section.' />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setRows((r) => [...r, blank()])} className="bg-gold hover:bg-gold-dark text-black"><Plus className="w-4 h-4 mr-1" />New item</Button>
      </div>
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="grid gap-3">
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-1"><Label>Order</Label><Input type="number" value={r.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div className="md:col-span-3"><Label>Text (EN)</Label><Input value={r.text_en} onChange={(e) => update(i, { text_en: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div className="md:col-span-3"><Label>Text (PT)</Label><Input value={r.text_pt} onChange={(e) => update(i, { text_pt: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div className="md:col-span-3"><Label>Text (FR)</Label><Input value={r.text_fr} onChange={(e) => update(i, { text_fr: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div className="md:col-span-1 flex items-center gap-2"><Label className="text-xs text-gray-400">Active</Label><Switch checked={r.active} onCheckedChange={(v) => update(i, { active: v })} /></div>
              <div className="md:col-span-1 flex gap-1">
                <Button size="sm" onClick={() => save(r)} className="bg-gold hover:bg-gold-dark text-black"><Save className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => remove(r)} className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminPrivateTourIncluded;