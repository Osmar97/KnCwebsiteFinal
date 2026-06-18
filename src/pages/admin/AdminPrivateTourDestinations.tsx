import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Upload, X, ArrowUp, ArrowDown, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  fetchTourDestinationsAdmin,
  upsertTourDestination,
  deleteTourDestination,
  uploadDestinationImage,
} from "@/data/privateTour";

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
  archived: boolean;
  region: string;
  card_image_url: string | null;
  hero_image_url: string | null;
  label_en: string; label_pt: string; label_fr: string;
  desc_en: string;  desc_pt: string;  desc_fr: string;
};

const blank = (): Row => ({
  slug: "", flag: "", min_days: 3, max_days: 7, min_guests: 1, max_guests: 10,
  base_price_per_day_per_person: 1900, currency: "EUR", sort_order: 0, active: true,
  archived: false, region: "", card_image_url: null, hero_image_url: null,
  label_en: "", label_pt: "", label_fr: "", desc_en: "", desc_pt: "", desc_fr: "",
});

const AdminPrivateTourDestinations = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTourDestinationsAdmin();
      setRows((data as any[]).map((r) => ({
        ...r,
        archived: r.archived ?? false,
        region: r.region ?? "",
        card_image_url: r.card_image_url ?? null,
        hero_image_url: r.hero_image_url ?? null,
      })));
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

  const moveRow = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const a = { ...rows[i] };
    const b = { ...rows[j] };
    const tmp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = tmp;
    setRows((r) => r.map((x, idx) => (idx === i ? a : idx === j ? b : x)));
    try {
      if (a.id) await upsertTourDestination(a as any);
      if (b.id) await upsertTourDestination(b as any);
      load();
    } catch (error: any) {
      toast({ title: "Reorder failed", description: error.message, variant: "destructive" });
    }
  };

  const handleImage = async (
    i: number,
    field: "card_image_url" | "hero_image_url",
    file: File | null,
  ) => {
    if (!file) return;
    setUploading(`${i}-${field}`);
    try {
      const url = await uploadDestinationImage(file);
      update(i, { [field]: url } as any);
      toast({ title: "Image uploaded" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  return (
    <AdminLayout
      title="Destinations · Where We Go"
      description="Manage the destinations shown in the public WHERE WE GO section and the private-tour booking flow."
      actions={
        <Button onClick={() => setRows((r) => [...r, blank()])} className="bg-gold hover:bg-gold-dark text-black">
          <Plus className="w-4 h-4 mr-1" /> New destination
        </Button>
      }
    >
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="grid gap-4">
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">{r.flag || "🏳️"}</span>
                <Input value={r.label_en} placeholder="Label (EN)" onChange={(e) => update(i, { label_en: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                <Input value={r.slug} placeholder="slug" onChange={(e) => update(i, { slug: e.target.value })} className="bg-gray-900 border-gray-800 text-white max-w-xs" />
                {r.archived && (
                  <span className="px-2 py-0.5 text-xs rounded bg-yellow-900/40 text-yellow-300 border border-yellow-700/50">Archived</span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Label className="text-xs text-gray-400">Published</Label>
                  <Switch checked={r.active} onCheckedChange={(v) => update(i, { active: v })} />
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" disabled={i === 0} onClick={() => moveRow(i, -1)} title="Move up"><ArrowUp className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" disabled={i === rows.length - 1} onClick={() => moveRow(i, 1)} title="Move down"><ArrowDown className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["card_image_url", "hero_image_url"] as const).map((field) => (
                  <div key={field} className="border border-gray-800 rounded p-3 bg-gray-900/50">
                    <Label className="text-xs text-gray-400 uppercase tracking-wider">
                      {field === "card_image_url" ? "Card image (Where We Go grid)" : "Hero image (detail pages)"}
                    </Label>
                    {r[field] ? (
                      <div className="mt-2 relative">
                        <img src={r[field] as string} alt="" className="w-full h-32 object-cover rounded" />
                        <button
                          onClick={() => update(i, { [field]: null } as any)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 h-32 border border-dashed border-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">
                        No image
                      </div>
                    )}
                    <div className="mt-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer border border-gray-700">
                        <Upload className="w-3 h-3" />
                        {uploading === `${i}-${field}` ? "Uploading…" : r[field] ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImage(i, field, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Region / city subtitle</Label><Input value={r.region} placeholder="e.g. Lisbon · Porto · Algarve" onChange={(e) => update(i, { region: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
                <div><Label>Flag emoji</Label><Input value={r.flag} onChange={(e) => update(i, { flag: e.target.value })} className="bg-gray-900 border-gray-800 text-white" /></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800" onClick={() => update(i, { archived: !r.archived })}>
                  {r.archived ? (<><ArchiveRestore className="w-4 h-4 mr-1" />Unarchive</>) : (<><Archive className="w-4 h-4 mr-1" />Archive</>)}
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(r)} className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPrivateTourDestinations;