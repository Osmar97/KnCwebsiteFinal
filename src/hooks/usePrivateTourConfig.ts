import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/pages/TourTranslations";

export interface DestinationRow {
  id: string;
  slug: string;
  flag: string;
  min_days: number;
  max_days: number;
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

export interface PrivateTourConfig {
  destinations: DestinationRow[];
  addons: AddonRow[];
  included: IncludedItemRow[];
  callSlots: ClarityCallSlotRow[];
  tourDates: AvailableTourDateRow[];
  loading: boolean;
  error: string | null;
}

export function pickLocale<T extends Record<string, unknown>>(row: T, field: string, lang: Language): string {
  const v = row[`${field}_${lang}`] ?? row[`${field}_en`];
  return v ? String(v) : "";
}

export function usePrivateTourConfig(): PrivateTourConfig {
  const [state, setState] = useState<PrivateTourConfig>({
    destinations: [], addons: [], included: [], callSlots: [], tourDates: [],
    loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const todayIso = new Date().toISOString().slice(0, 10);
        const [destRes, addonRes, incRes, slotRes, dateRes] = await Promise.all([
          supabase.from("tour_destinations").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_addons").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_included_items").select("*").eq("active", true).order("sort_order", { ascending: true }),
          supabase.from("tour_clarity_call_slots").select("*").eq("is_available", true).gt("slot_at", new Date().toISOString()).order("slot_at", { ascending: true }).limit(20),
          supabase.from("tour_dates").select("id,start_date,end_date,capacity,sold_out,label").gte("start_date", todayIso).order("start_date", { ascending: true }),
        ]);
        if (cancelled) return;
        if (destRes.error) throw destRes.error;
        if (addonRes.error) throw addonRes.error;
        if (incRes.error) throw incRes.error;
        setState({
          destinations: (destRes.data ?? []) as DestinationRow[],
          addons: (addonRes.data ?? []) as AddonRow[],
          included: (incRes.data ?? []) as IncludedItemRow[],
          callSlots: (slotRes.data ?? []) as ClarityCallSlotRow[],
          tourDates: (dateRes.data ?? []) as AvailableTourDateRow[],
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