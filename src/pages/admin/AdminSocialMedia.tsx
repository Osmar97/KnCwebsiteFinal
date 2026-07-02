import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Upload, ArrowUp, ArrowDown, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  fetchSocialLinks,
  upsertSocialLinks,
  fetchIgImagesAdmin,
  upsertIgImage,
  deleteIgImage,
  uploadIgImage,
  type IgImage,
  type SocialLinks,
} from "@/data/socialMedia";

const blankImage = (sort_order = 0): IgImage => ({
  image_url: "",
  post_url: null,
  caption: null,
  sort_order,
  published: true,
});

const AdminSocialMedia = () => {
  const [links, setLinks] = useState<SocialLinks>({
    instagram_url: "",
    instagram_username: "",
    facebook_url: "",
    linkedin_url: "",
  });
  const [images, setImages] = useState<IgImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLinks, setSavingLinks] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [l, i] = await Promise.all([fetchSocialLinks(), fetchIgImagesAdmin()]);
      if (l) setLinks(l);
      setImages(i);
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const saveLinks = async () => {
    setSavingLinks(true);
    try {
      const saved = await upsertSocialLinks(links);
      setLinks(saved);
      toast({ title: "Social links saved" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSavingLinks(false);
    }
  };

  const updateImg = (i: number, patch: Partial<IgImage>) =>
    setImages((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const moveImg = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((row, idx) => { row.sort_order = idx + 1; });
    setImages(next);
  };

  const saveImg = async (row: IgImage) => {
    try {
      if (!row.image_url.trim()) {
        toast({ title: "Image is required", variant: "destructive" });
        return;
      }
      await upsertIgImage(row);
      toast({ title: "Image saved" });
      load();
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const removeImg = async (row: IgImage, i: number) => {
    if (!row.id) return setImages((r) => r.filter((_, idx) => idx !== i));
    if (!confirm("Delete this image?")) return;
    try {
      await deleteIgImage(row.id);
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
      const url = await uploadIgImage(file);
      const current = images[i];
      const nextRow = { ...current, image_url: url };
      updateImg(i, { image_url: url });
      if (current.id) {
        try {
          await upsertIgImage(nextRow);
          toast({ title: "Image uploaded & saved" });
        } catch (err: any) {
          toast({
            title: "Uploaded, but save failed",
            description: err.message + " — click Save to retry.",
            variant: "destructive",
          });
        }
      } else {
        toast({ title: "Image uploaded", description: "Click Save to publish this tile." });
      }
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <AdminLayout
      title="Site Settings · Social Media"
      description="Manage social links and the Instagram showcase gallery shown on the public Tours page."
    >
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-8">
          {/* Social links */}
          <section className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
            <h2 className="text-lg text-gold font-light tracking-wide">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Instagram URL</Label>
                <Input
                  value={links.instagram_url}
                  onChange={(e) => setLinks({ ...links, instagram_url: e.target.value })}
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
              <div>
                <Label>Instagram Username</Label>
                <Input
                  value={links.instagram_username}
                  onChange={(e) => setLinks({ ...links, instagram_username: e.target.value })}
                  placeholder="ismaelgq_"
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
              <div>
                <Label>Facebook URL</Label>
                <Input
                  value={links.facebook_url}
                  onChange={(e) => setLinks({ ...links, facebook_url: e.target.value })}
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={links.linkedin_url}
                  onChange={(e) => setLinks({ ...links, linkedin_url: e.target.value })}
                  className="bg-gray-900 border-gray-800 text-white"
                />
              </div>
            </div>
            <Button onClick={saveLinks} disabled={savingLinks} className="bg-gold hover:bg-gold-dark text-black">
              <Save className="w-4 h-4 mr-1" /> {savingLinks ? "Saving…" : "Save links"}
            </Button>
          </section>

          {/* Instagram showcase */}
          <section className="bg-gray-950 border border-gray-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg text-gold font-light tracking-wide">Instagram Showcase</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Curated gallery shown publicly. The first 6 published images are displayed.
                </p>
              </div>
              <Button
                onClick={() => setImages((r) => [...r, blankImage(r.length + 1)])}
                className="bg-gold hover:bg-gold-dark text-black"
              >
                <Plus className="w-4 h-4 mr-1" /> New image
              </Button>
            </div>

            {images.length === 0 && (
              <p className="text-gray-400 text-sm">No images yet. Click "New image" to add one.</p>
            )}

            <div className="grid gap-3">
              {images.map((r, i) => (
                <div key={r.id ?? `new-${i}`} className="bg-black/40 border border-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500">#{i + 1}</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button size="sm" variant="outline" onClick={() => moveImg(i, -1)} disabled={i === 0} className="border-gray-700 text-gray-300">
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => moveImg(i, 1)} disabled={i === images.length - 1} className="border-gray-700 text-gray-300">
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Label className="text-xs text-gray-400 ml-2">Published</Label>
                      <Switch checked={r.published} onCheckedChange={(v) => updateImg(i, { published: v })} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-4">
                    {r.image_url ? (
                      <div className="relative">
                        <img src={r.image_url} alt="" className="w-28 h-28 object-cover rounded border border-gray-800" />
                        <button
                          type="button"
                          onClick={() => updateImg(i, { image_url: "" })}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                          aria-label="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded border border-dashed border-gray-700 flex items-center justify-center text-xs text-gray-500">
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
                    <div className="flex-1 min-w-[240px] space-y-2">
                      <div>
                        <Label>Instagram post URL (optional)</Label>
                        <Input
                          value={r.post_url ?? ""}
                          onChange={(e) => updateImg(i, { post_url: e.target.value || null })}
                          placeholder="https://www.instagram.com/p/…"
                          className="bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                      <div>
                        <Label>Caption / alt text (optional)</Label>
                        <Input
                          value={r.caption ?? ""}
                          onChange={(e) => updateImg(i, { caption: e.target.value || null })}
                          className="bg-gray-900 border-gray-800 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                    <Button size="sm" onClick={() => saveImg(r)} className="bg-gold hover:bg-gold-dark text-black">
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImg(r, i)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSocialMedia;