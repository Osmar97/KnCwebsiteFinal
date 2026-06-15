import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { fetchPrivateTourSettings, savePrivateTourSettings, type PrivateTourSettings as Settings } from "@/data/privateTour";

const DEFAULTS: Settings = {
  min_days: 3, max_days: 14, default_currency: "EUR",
  deposit_ratio: 0.3, promo_label: "", promo_discount_pct: null,
};

const AdminPrivateTourSettings = () => {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPrivateTourSettings();
        if (data) setS({
          min_days: data.min_days, max_days: data.max_days,
          default_currency: data.default_currency,
          deposit_ratio: Number(data.deposit_ratio),
          promo_label: data.promo_label, promo_discount_pct: data.promo_discount_pct as number | null,
        });
      } catch (error: any) {
        toast({ title: "Load failed", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await savePrivateTourSettings(s);
      toast({ title: "Settings saved" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Private Tour · Settings" description="Global Private Tour configuration (duration, currency, deposit, promo).">
      {loading ? <p className="text-gray-400">Loading…</p> : (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 max-w-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min days</Label>
              <Input type="number" min={1} value={s.min_days}
                onChange={(e) => setS({ ...s, min_days: Number(e.target.value) })}
                className="bg-gray-900 border-gray-800 text-white" />
            </div>
            <div>
              <Label>Max days</Label>
              <Input type="number" min={1} value={s.max_days}
                onChange={(e) => setS({ ...s, max_days: Number(e.target.value) })}
                className="bg-gray-900 border-gray-800 text-white" />
            </div>
            <div>
              <Label>Default currency</Label>
              <Input value={s.default_currency} maxLength={3}
                onChange={(e) => setS({ ...s, default_currency: e.target.value.toUpperCase() })}
                className="bg-gray-900 border-gray-800 text-white" />
            </div>
            <div>
              <Label>Deposit ratio (0–1)</Label>
              <Input type="number" step="0.01" min={0} max={1} value={s.deposit_ratio}
                onChange={(e) => setS({ ...s, deposit_ratio: Number(e.target.value) })}
                className="bg-gray-900 border-gray-800 text-white" />
            </div>
            <div>
              <Label>Promo label</Label>
              <Input value={s.promo_label ?? ""}
                onChange={(e) => setS({ ...s, promo_label: e.target.value || null })}
                className="bg-gray-900 border-gray-800 text-white" placeholder="e.g. Summer 10% off" />
            </div>
            <div>
              <Label>Promo discount %</Label>
              <Input type="number" step="0.5" value={s.promo_discount_pct ?? ""}
                onChange={(e) => setS({ ...s, promo_discount_pct: e.target.value === "" ? null : Number(e.target.value) })}
                className="bg-gray-900 border-gray-800 text-white" />
            </div>
          </div>
          <Button onClick={save} disabled={saving} className="bg-gold hover:bg-gold-dark text-black">
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPrivateTourSettings;