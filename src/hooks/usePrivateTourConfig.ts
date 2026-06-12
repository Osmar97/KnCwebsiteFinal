import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/pages/TourTranslations";

export interface DestinationRow {
  id: string;
  slug: string;
  flag: string;
  min_days: number;
  max_days: number;
  min_guests: number;
  max_guests: number;
  base_price_per_day_per_person: number;
  currency: string;
  sort_order: number;
  label_en: string; label_pt: string; label_fr: string;
  desc_en: string; desc_pt: string; desc_fr: string;
}

export interface AddonRow {
  id: string;
  slug: string;
  icon: string;
  price: number;
  is_complimentary: boolean;
  currency: string;
  sort_order: number;
  label_en: string; label_pt: string; label_fr: string;
  desc_en: string; desc_pt: string; desc_fr: string;
  note_en: string; note_pt: string; note_fr: string;
}

export interface IncludedItemRow {
  id: string;
  sort_order: number;
  text_en: string; text_pt: string; text_fr: string;
}

export interface ClarityCallSlotRow {
  id: string;
  slot_at: string;
  duration_minutes: number;
  is_available: boolean;
}

export interface AvailableTourDateRow {
  id: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean;
  label: string | null;
}

export interface PrivateTourSettingsRow {
  min_days: number;
  max_days: number;
  default_currency: string;
  deposit_ratio: number;
  promo_label: string | null;
  promo_discount_pct: number | null;
}

export interface PrivateTourConfig {
  destinations: DestinationRow[];
  addons: AddonRow[];
  included: IncludedItemRow[];
  callSlots: ClarityCallSlotRow[];
  tourDates: AvailableTourDateRow[];
  settings: PrivateTourSettingsRow;
  loading: boolean;
  error: string | null;
}

export function pickLocale<T extends Record<string, unknown>>(row: T, field: string, lang: Language): string {
  const v = row[`${field}_${lang}`] ?? row[`${field}_en`];
  return v ? String(v) : "";
}

const DEFAULT_SETTINGS: PrivateTourSettingsRow = {
  min_days: 3, max_days: 14, default_currency: "EUR",
  deposit_ratio: 0.3, promo_label: null, promo_discount_pct: null,
};

export function usePrivateTourConfig(): PrivateTourConfig {
  const [state, setState] = useState<PrivateTourConfig>({
    destinations: [], addons: [], included: [], callSlots: [], tourDates: [],
    settings: DEFAULT_SETTINGS,
    loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const todayIso = new Date().toISOString().slice(0, 10);
        const [destRes, addonRes, incRes, slotRes, dateRes, settingsRes] = await Promise.all([
          supabase.from("tour_destinations").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_addons").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_included_items").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_clarity_call_slots").select("*").eq("is_available", true).gt("slot_at", new Date().toISOString()).order("slot_at", { ascending: true }).limit(20),
          supabase.from("tour_dates").select("id,start_date,end_date,capacity,sold_out,label").gte("start_date", todayIso).order("start_date", { ascending: true }),
          (supabase.from as any)("private_tour_settings").select("*").eq("id", true).maybeSingle(),
        ]);
        if (cancelled) return;
        if (destRes.error) throw destRes.error;
        if (addonRes.error) throw addonRes.error;
        if (incRes.error) throw incRes.error;
        const s = (settingsRes as any)?.data;
        const settings: PrivateTourSettingsRow = s ? {
          min_days: s.min_days, max_days: s.max_days,
          default_currency: s.default_currency,
          deposit_ratio: Number(s.deposit_ratio),
          promo_label: s.promo_label, promo_discount_pct: s.promo_discount_pct,
        } : DEFAULT_SETTINGS;
        setState({
          destinations: (destRes.data ?? []) as DestinationRow[],
          addons: (addonRes.data ?? []) as AddonRow[],
          included: (incRes.data ?? []) as IncludedItemRow[],
          callSlots: (slotRes.data ?? []) as ClarityCallSlotRow[],
          tourDates: (dateRes.data ?? []) as AvailableTourDateRow[],
          settings,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("usePrivateTourConfig failed:", err);
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: (err as Error).message }));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}