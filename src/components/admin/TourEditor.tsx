import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminTour } from "@/hooks/admin/useAdminTours";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Upload, X, ArrowLeft } from "lucide-react";

interface Props {
  tourId: string | null;
  onClose: () => void;
}

interface DateRow {
  id?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean;
  label: string | null;
  _isNew?: boolean;
  _delete?: boolean;
}

const empty = {
  slug: "",
  status: "draft",
  sort_order: 0,
  category: "private",
  tour_type: "private",
  duration_days: 1,
  destinations: [] as string[],
  tags: [] as string[],
  hero_image: null as string | null,
  gallery: [] as string[],
  flag: null as string | null,
  badge: null as string | null,
  badge_variant: null as string | null,
  base_price: 0,
  early_bird_price: null as number | null,
  premium_price: null as number | null,
  currency: "EUR",
  name_en: "", name_pt: "", name_fr: "",
  short_desc_en: "", short_desc_pt: "", short_desc_fr: "",
  description_en: "", description_pt: "", description_fr: "",
};

const csvToArray = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);
const arrayToCsv = (a: string[] | null | undefined) => (a ?? []).join(", ");

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const TourEditor = ({ tourId, onClose }: Props) => {
  const { supabaseUser } = useAdmin();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(empty);
  const [dates, setDates] = useState<DateRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: loaded, isLoading } = useAdminTour(tourId);

  useEffect(() => {
    if (loaded) {
      const { tour_dates: td, ...rest } = loaded as any;
      setForm({ ...empty, ...rest });
      setDates(((td as DateRow[]) ?? []).sort((a, b) => a.start_date.localeCompare(b.start_date)));
    }
  }, [loaded]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const uploadImage = async (file: File): Promise<string> => {
    if (!supabaseUser) throw new Error("Not authenticated");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `tours/${supabaseUser.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("property-images").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("property-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      update("hero_image", url);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of files) urls.push(await uploadImage(f));
      update("gallery", [...(form.gallery ?? []), ...urls]);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Validation
      if (!form.name_en?.trim()) throw new Error("English name is required");
      if (!form.slug?.trim()) throw new Error("Slug is required");
      const payload = {
        ...form,
        slug: slugify(form.slug),
        base_price: Number(form.base_price) || 0,
        early_bird_price: form.early_bird_price === "" || form.early_bird_price == null ? null : Number(form.early_bird_price),
        premium_price: form.premium_price === "" || form.premium_price == null ? null : Number(form.premium_price),
        duration_days: Number(form.duration_days) || 1,
        sort_order: Number(form.sort_order) || 0,
        destinations: form.destinations ?? [],
        tags: form.tags ?? [],
        gallery: form.gallery ?? [],
      };
      let savedId = tourId;
      if (tourId) {
        const { error } = await supabase.from("tours").update(payload).eq("id", tourId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("tours").insert(payload).select("id").single();
        if (error) throw error;
        savedId = data.id;
      }
      // Sync dates
      for (const d of dates) {
        if (d._delete && d.id) {
          const { error } = await supabase.from("tour_dates").delete().eq("id", d.id);
          if (error) throw error;
        } else if (d._isNew) {
          const { error } = await supabase.from("tour_dates").insert({
            tour_id: savedId, start_date: d.start_date, end_date: d.end_date,
            capacity: Number(d.capacity) || 0, sold_out: !!d.sold_out, label: d.label || null,
          });
          if (error) throw error;
        } else if (d.id) {
          const { error } = await supabase.from("tour_dates").update({
            start_date: d.start_date, end_date: d.end_date,
            capacity: Number(d.capacity) || 0, sold_out: !!d.sold_out, label: d.label || null,
          }).eq("id", d.id);
          if (error) throw error;
        }
      }
      return savedId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tours"] });
      toast({ title: "Tour saved" });
      onClose();
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  if (isLoading) {
    return <div className="text-gray-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClose} className="border-gray-700 text-gray-200 hover:bg-gray-800 min-h-[40px]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-200 hover:bg-gray-800 min-h-[44px]">Cancel</Button>
          <Button onClick={() => { setSaving(true); saveMutation.mutate(undefined, { onSettled: () => setSaving(false) }); }}
            disabled={saving || saveMutation.isPending}
            className="bg-gold text-black hover:bg-gold-dark min-h-[44px]">
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Save Tour
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800 overflow-x-auto flex-wrap h-auto">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="dates">Dates & Capacity</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="taxonomy">Destinations & Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug *" hint="URL-friendly identifier (auto-cleaned).">
              <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Tour Type">
              <select value={form.tour_type} onChange={(e) => update("tour_type", e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-white">
                <option value="private">Private</option>
                <option value="group">Group</option>
              </select>
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={(e) => update("category", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Duration (days)">
              <Input type="number" min={1} value={form.duration_days} onChange={(e) => update("duration_days", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Sort order">
              <Input type="number" value={form.sort_order} onChange={(e) => update("sort_order", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Flag (optional)">
              <Input value={form.flag ?? ""} onChange={(e) => update("flag", e.target.value || null)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Badge (optional)">
              <Input value={form.badge ?? ""} onChange={(e) => update("badge", e.target.value || null)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Badge variant (optional)">
              <Input value={form.badge_variant ?? ""} onChange={(e) => update("badge_variant", e.target.value || null)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-5 space-y-4">
          {(["en", "pt", "fr"] as const).map((lng) => (
            <div key={lng} className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="text-gold text-sm uppercase tracking-wider">{lng.toUpperCase()}</h3>
              <Field label="Name">
                <Input value={form[`name_${lng}`]} onChange={(e) => update(`name_${lng}`, e.target.value)} className="bg-black border-gray-800 text-white" />
              </Field>
              <Field label="Short description">
                <Textarea rows={2} value={form[`short_desc_${lng}`]} onChange={(e) => update(`short_desc_${lng}`, e.target.value)} className="bg-black border-gray-800 text-white" />
              </Field>
              <Field label="Description">
                <Textarea rows={5} value={form[`description_${lng}`]} onChange={(e) => update(`description_${lng}`, e.target.value)} className="bg-black border-gray-800 text-white" />
              </Field>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pricing" className="mt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Currency">
              <Input value={form.currency} onChange={(e) => update("currency", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Base price *">
              <Input type="number" min={0} value={form.base_price} onChange={(e) => update("base_price", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Early-bird price (optional)">
              <Input type="number" min={0} value={form.early_bird_price ?? ""} onChange={(e) => update("early_bird_price", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
            <Field label="Premium price (optional)">
              <Input type="number" min={0} value={form.premium_price ?? ""} onChange={(e) => update("premium_price", e.target.value)} className="bg-gray-950 border-gray-800 text-white" />
            </Field>
          </div>
        </TabsContent>

        <TabsContent value="dates" className="mt-5 space-y-3">
          {dates.filter((d) => !d._delete).length === 0 && (
            <p className="text-sm text-gray-400">No dates yet. Add one below.</p>
          )}
          {dates.map((d, i) => d._delete ? null : (
            <div key={d.id ?? `new-${i}`} className="bg-gray-950 border border-gray-800 rounded-lg p-3 grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
              <Field label="Start">
                <Input type="date" value={d.start_date} onChange={(e) => setDates((p) => p.map((x, idx) => idx === i ? { ...x, start_date: e.target.value } : x))} className="bg-black border-gray-800 text-white" />
              </Field>
              <Field label="End">
                <Input type="date" value={d.end_date} onChange={(e) => setDates((p) => p.map((x, idx) => idx === i ? { ...x, end_date: e.target.value } : x))} className="bg-black border-gray-800 text-white" />
              </Field>
              <Field label="Capacity">
                <Input type="number" min={0} value={d.capacity} onChange={(e) => setDates((p) => p.map((x, idx) => idx === i ? { ...x, capacity: Number(e.target.value) } : x))} className="bg-black border-gray-800 text-white" />
              </Field>
              <Field label="Label">
                <Input value={d.label ?? ""} onChange={(e) => setDates((p) => p.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} className="bg-black border-gray-800 text-white" />
              </Field>
              <label className="flex items-center gap-2 text-sm text-gray-300 mt-5">
                <input type="checkbox" checked={d.sold_out} onChange={(e) => setDates((p) => p.map((x, idx) => idx === i ? { ...x, sold_out: e.target.checked } : x))} />
                Sold out
              </label>
              <Button variant="outline" size="sm" onClick={() => setDates((p) => p.map((x, idx) => idx === i ? { ...x, _delete: true } : x))}
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white min-h-[40px]">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setDates((p) => [...p, { start_date: "", end_date: "", capacity: 10, sold_out: false, label: "", _isNew: true }])}
            className="border-gold text-gold hover:bg-gold hover:text-black min-h-[44px]">
            <Plus className="w-4 h-4 mr-1" /> Add date
          </Button>
        </TabsContent>

        <TabsContent value="media" className="mt-5 space-y-5">
          <div>
            <Label className="text-sm text-gray-300">Hero image</Label>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {form.hero_image ? (
                <div className="relative w-48 h-32 rounded overflow-hidden border border-gray-800">
                  <img src={form.hero_image} alt="hero" className="w-full h-full object-cover" />
                  <button onClick={() => update("hero_image", null)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1"><X className="w-3 h-3 text-white" /></button>
                </div>
              ) : (
                <div className="w-48 h-32 border border-dashed border-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">No hero image</div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gold text-gold hover:bg-gold hover:text-black min-h-[44px]">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              </label>
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-300">Gallery</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {(form.gallery ?? []).map((url: string, i: number) => (
                <div key={i} className="relative aspect-video rounded overflow-hidden border border-gray-800">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => update("gallery", form.gallery.filter((_: string, idx: number) => idx !== i))} className="absolute top-1 right-1 bg-black/70 rounded-full p-1"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
              <label className="cursor-pointer aspect-video flex items-center justify-center gap-2 border border-dashed border-gold/60 rounded text-gold text-sm hover:bg-gold/5">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="taxonomy" className="mt-5 space-y-4">
          <Field label="Destinations (comma separated)">
            <Input value={arrayToCsv(form.destinations)} onChange={(e) => update("destinations", csvToArray(e.target.value))} className="bg-gray-950 border-gray-800 text-white" />
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={arrayToCsv(form.tags)} onChange={(e) => update("tags", csvToArray(e.target.value))} className="bg-gray-950 border-gray-800 text-white" />
          </Field>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <Label className="text-xs uppercase tracking-wider text-gray-400">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
  </div>
);

export default TourEditor;