import { useEffect, useState } from "react";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAdminTourList, fetchUpcomingTourDates, upsertTourDate, deleteTourDate } from "@/data/privateTour";

type Tour = { id: string; name_en: string };
type Row = {
  id?: string; tour_id: string;
  start_date: string; end_date: string;
  capacity: number; sold_out: boolean; label: string | null;
};

const blank = (tourId: string): Row => ({
  tour_id: tourId, start_date: "", end_date: "",
  capacity: 9, sold_out: false, label: "",
});

const AdminPrivateTourDates = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [t, d] = await Promise.all([fetchAdminTourList(), fetchUpcomingTourDates()]);
      setTours(t as any);
      setRows(d as any);
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (i: number, p: Partial<Row>) => setRows((r) => r.map((row, idx) => idx === i ? { ...row, ...p } : row));

  const save = async (row: Row) => {
    if (!row.tour_id) return toast({ title: "Pick a tour first", variant: "destructive" });
    if (!row.start_date || !row.end_date) return toast({ title: "Start & end dates required", variant: "destructive" });
    try {
      await upsertTourDate(row as any);
      toast({ title: "Saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const remove = async (row: Row) => {
    if (!row.id) return setRows((r) => r.filter((x) => x !== row));
    if (!confirm("Delete this date?")) return;
    try {
      await deleteTourDate(row.id);
      toast({ title: "Deleted" });
      load();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const tourName = (id: string) => tours.find((t) => t.id === id)?.name_en ?? "—";

  return (
    <>
      <AdminPageMeta title="Private Tour · Available Dates" description="Upcoming dates available to bookers (shared with all tours)." />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setRows((r) => [...r, blank(tours[0]?.id ?? "")])} className="bg-gold hover:bg-gold-dark text-black"><Plus className="w-4 h-4 mr-1" />New date</Button>
      </div>
      {loading ? <p className="text-gray-400">Loading…</p> : rows.length === 0 ? (
        <p className="text-gray-400">No upcoming dates.</p>
      ) : (
        <div className="grid gap-3">
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2">
                <Label>Tour</Label>
                <select value={r.tour_id} onChange={(e) => update(i, { tour_id: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-md h-10 px-3">
                  <option value="">— pick —</option>
                  {tours.map((t) => <option key={t.id} value={t.id}>{t.name_en}</option>)}
                </select>
                {!r.tour_id && r.id && <p className="text-xs text-gray-500 mt-1">{tourName(r.tour_id)}</p>}
              </div>
              <div><Label>Start</Label><Input type="date" value={r.start_date} onChange={(e) => update(i, { start_date: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div><Label>End</Label><Input type="date" value={r.end_date} onChange={(e) => update(i, { end_date: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div><Label>Capacity</Label><Input type="number" min={0} value={r.capacity} onChange={(e) => update(i, { capacity: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" /></div>
              <div><Label>Label</Label><Input value={r.label ?? ""} onChange={(e) => update(i, { label: e.target.value || null })} placeholder="optional" className="bg-gray-900 border-gray-800 text-white" /></div>
              <div className="flex items-center gap-2 md:col-span-1">
                <Label className="text-xs text-gray-400">Sold out</Label>
                <Switch checked={r.sold_out} onCheckedChange={(v) => update(i, { sold_out: v })} />
              </div>
              <div className="flex gap-2 md:col-span-6">
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

export default AdminPrivateTourDates;