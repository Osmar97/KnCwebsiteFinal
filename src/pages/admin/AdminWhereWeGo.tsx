import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Upload, ArrowUp, ArrowDown, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  fetchWhereWeGoAdmin,
  upsertWhereWeGo,
  deleteWhereWeGo,
  uploadWhereWeGoImage,
  type WhereWeGoCard,
} from "@/data/whereWeGo";

const blank = (sort_order = 0): WhereWeGoCard => ({
  country_name_en: "",
  country_name_pt: "",
  country_name_fr: "",
  subtitle_en: "",
  subtitle_pt: "",
  subtitle_fr: "",
  description_en: "",
  description_pt: "",
  description_fr: "",
  image_url: null,
  sort_order,
  published: true,
});

const AdminWhereWeGo = () => {
  const [rows, setRows] = useState<WhereWeGoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = async () => {
    setLoading(true);
    try {
      setRows(await fetchWhereWeGoAdmin());
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (i: number, patch: Partial<WhereWeGoCard>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((row, idx) => { row.sort_order = idx + 1; });
    setRows(next);
  };

  const save = async (row: WhereWeGoCard) => {
    try {
      if (!row.country_name_en.trim()) {
        toast({ title: "Country name (EN) is required", variant: "destructive" });
        return;
      }
      await upsertWhereWeGo(row);
      toast({ title: "Saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const remove = async (row: WhereWeGoCard, i: number) => {
    if (!row.id) return setRows((r) => r.filter((_, idx) => idx !== i));
    if (!confirm(`Delete card "${row.country_name_en}"?`)) return;
    try {
      await deleteWhereWeGo(row.id);
      toast({ title: "Deleted" });
      load();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const onPickImage = async (i: number, file: File | null) => {
    if (!file) return;
    setUploadingIdx(i);
    try {
      const url = await uploadWhereWeGoImage(file);
      update(i, { image_url: url });
      toast({ title: "Image uploaded" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <AdminLayout
      title="Tours · Where We Go"
      description="Manage the country cards displayed in the public WHERE WE GO section. Independent from Private Tour configuration."
      actions={
        <Button
          onClick={() => setRows((r) => [...r, blank(r.length + 1)])}
          className="bg-gold hover:bg-gold-dark text-black"
        >
          <Plus className="w-4 h-4 mr-1" /> New card
        </Button>
      }
    >
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="grid gap-4">
          {rows.length === 0 && (
            <p className="text-gray-400">No cards yet. Click "New card" to add one.</p>
          )}
          {rows.map((r, i) => (
            <div key={r.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={r.country_name_en}
                  placeholder="Country (EN) *"
                  onChange={(e) => update(i, { country_name_en: e.target.value })}
                  className="bg-gray-900 border-gray-800 text-white max-w-xs"
                />
                <div className="flex items-center gap-2 ml-auto">
                  <Button size="sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0} className="border-gray-700 text-gray-300">
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => move(i, 1)} disabled={i === rows.length - 1} className="border-gray-700 text-gray-300">
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Label className="text-xs text-gray-400 ml-2">Published</Label>
                  <Switch checked={r.published} onCheckedChange={(v) => update(i, { published: v })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Country (PT)</Label>
                  <Input value={r.country_name_pt ?? ""} onChange={(e) => update(i, { country_name_pt: e.target.value })} className="bg-gray-900 border-gray-800 text-white" />
                </div>
                <div>
                  <Label>Country (FR)</Label>
                  <Input value={r.country_name_fr ?? ""} onChange={(e) => update(i, { country_name_fr: e.target.value })} className="bg-gray-900 border-gray-800 text-white" />
                </div>
                <div>
                  <Label>Sort order</Label>
                  <Input type="number" value={r.sort_order} onChange={(e) => update(i, { sort_order: Number(e.target.value) })} className="bg-gray-900 border-gray-800 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["en", "pt", "fr"] as const).map((l) => (
                  <div key={l}>
                    <Label>Subtitle / Region ({l.toUpperCase()})</Label>
                    <Input
                      value={(r as any)[`subtitle_${l}`] ?? ""}
                      onChange={(e) => update(i, { [`subtitle_${l}`]: e.target.value } as any)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["en", "pt", "fr"] as const).map((l) => (
                  <div key={l}>
                    <Label>Description ({l.toUpperCase()})</Label>
                    <Textarea
                      rows={2}
                      value={(r as any)[`description_${l}`] ?? ""}
                      onChange={(e) => update(i, { [`description_${l}`]: e.target.value } as any)}
                      className="bg-gray-900 border-gray-800 text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {r.image_url ? (
                  <div className="relative">
                    <img src={r.image_url} alt="" className="w-32 h-20 object-cover rounded border border-gray-800" />
                    <button
                      type="button"
                      onClick={() => update(i, { image_url: null })}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-20 rounded border border-dashed border-gray-700 flex items-center justify-center text-xs text-gray-500">
                    No image
                  </div>
                )}
                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickImage(i, e.target.files?.[0] ?? null)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileRefs.current[i]?.click()}
                  disabled={uploadingIdx === i}
                  className="border-gray-700 text-gray-200"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {uploadingIdx === i ? "Uploading…" : r.image_url ? "Replace image" : "Upload image"}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => save(r)} className="bg-gold hover:bg-gold-dark text-black">
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(r, i)}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWhereWeGo;