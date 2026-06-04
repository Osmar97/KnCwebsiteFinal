import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, FileText, Video as VideoIcon, Loader2 } from "lucide-react";
import { validatePdf, validateVideo, ACCEPT_STRINGS } from "@/lib/uploadValidation";

interface AssetManagerProps {
  bucket: "pdfs" | "videos";
  maxSizeMb: number;
  label: string;
}

interface AssetFile {
  name: string;
  path: string;
  url: string;
  size?: number;
  updated_at?: string;
}

const sanitize = (name: string) =>
  name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\s+/g, "_").toLowerCase();

const logStorageAttempt = async (payload: {
  bucket: "pdfs" | "videos";
  action: "INSERT" | "UPDATE" | "DELETE";
  object_path?: string | null;
  success: boolean;
  error_message?: string | null;
}) => {
  try {
    await supabase.functions.invoke("log-storage-attempt", { body: payload });
  } catch {
    // Logging must never break the user flow.
  }
};

export const AssetManager = ({ bucket, accept, maxSizeMb, label }: AssetManagerProps) => {
  const { toast } = useToast();
  const { supabaseUser, isAdminLoggedIn } = useAdmin();
  const [files, setFiles] = useState<AssetFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const loadFiles = useCallback(async () => {
    if (!supabaseUser) return;
    setLoading(true);
    try {
      // List files inside the user's folder (matches our upload path scheme).
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(supabaseUser.id, { limit: 200, sortBy: { column: "created_at", order: "desc" } });

      if (error) throw error;

      const items: AssetFile[] = (data || [])
        .filter((f) => f.name && !f.name.endsWith("/"))
        .map((f) => {
          const path = `${supabaseUser.id}/${f.name}`;
          const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
          return {
            name: f.name,
            path,
            url: pub.publicUrl,
            size: (f.metadata as any)?.size,
            updated_at: f.updated_at,
          };
        });
      setFiles(items);
    } catch (err: any) {
      toast({ title: "Failed to load files", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [bucket, supabaseUser, toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || !supabaseUser || !isAdminLoggedIn) return;
    const arr = Array.from(list);
    setUploading(true);
    setProgress({ current: 0, total: arr.length });

    let i = 0;
    for (const file of arr) {
      i += 1;
      setProgress({ current: i, total: arr.length });

      const validate = bucket === "pdfs" ? validatePdf : validateVideo;
      const check = validate(file, maxSizeMb);
      if (!check.valid) {
        toast({
          title: "Upload rejected",
          description: check.error,
          variant: "destructive",
        });
        continue;
      }

      const path = `${supabaseUser.id}/${Date.now()}_${sanitize(file.name)}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

      logStorageAttempt({
        bucket,
        action: "INSERT",
        object_path: path,
        success: !error,
        error_message: error?.message ?? null,
      });

      if (error) {
        toast({
          title: "Upload failed",
          description: `${file.name}: ${error.message}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    setProgress(null);
    e.target.value = "";
    toast({ title: "Upload complete" });
    loadFiles();
  };

  const handleDelete = async (path: string) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    const { error } = await supabase.storage.from(bucket).remove([path]);
    logStorageAttempt({
      bucket,
      action: "DELETE",
      object_path: path,
      success: !error,
      error_message: error?.message ?? null,
    });
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "File deleted" });
    setFiles((prev) => prev.filter((f) => f.path !== path));
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "URL copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const Icon = bucket === "pdfs" ? FileText : VideoIcon;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{label}</h2>
          <p className="text-sm text-gray-400">Up to {maxSizeMb}MB per file. Admin only.</p>
        </div>
      <label className="cursor-pointer">
          <input
            type="file"
            accept={bucket === "pdfs" ? ACCEPT_STRINGS.pdf : ACCEPT_STRINGS.video}
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gold text-black font-medium hover:bg-gold-dark transition-colors disabled:opacity-50">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading && progress
              ? `Uploading ${progress.current}/${progress.total}…`
              : "Upload files"}
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/50">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No files uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {files.map((f) => (
              <li
                key={f.path}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <Icon className="w-5 h-5 text-gold shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{f.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(f.size)}
                    {f.updated_at && ` • ${new Date(f.updated_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyUrl(f.url)}
                    className="border-gold/40 text-gold hover:bg-gold hover:text-black"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy URL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(f.path)}
                    className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AssetManager;