import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/pages/TourTranslations";

export interface TourDateRow {
  id: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean;
  label: string | null;
}

export interface TourRow {
  id: string;
  slug: string;
  status: string;
  sort_order: number;
  category: string;
  tour_type: string;
  duration_days: number;
  destinations: string[];
  tags: string[];
  hero_image: string | null;
  gallery: string[];
  flag: string | null;
  badge: string | null;
  badge_variant: string | null;
  base_price: number;
  early_bird_price: number | null;
  premium_price: number | null;
  currency: string;
  name_en: string; name_pt: string; name_fr: string;
  short_desc_en: string; short_desc_pt: string; short_desc_fr: string;
  description_en: string; description_pt: string; description_fr: string;
  dates: TourDateRow[];
}

export interface AvailabilityRow {
  tour_date_id: string;
  tour_id: string;
  capacity: number;
  confirmed_count: number;
  remaining: number;
}

export function pickLocalized(
  row: Record<string, unknown>,
  field: string,
  lang: Language,
): string {
  const value = row[`${field}_${lang}`] ?? row[`${field}_en`];
  return value ? String(value) : "";
}

export function formatTourDateRange(d: TourDateRow, locale = "en-GB"): string {
  const start = new Date(d.start_date);
  const end = new Date(d.end_date);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "short" });
  const yearFmt = new Intl.DateTimeFormat(locale, { year: "numeric" });
  if (sameMonth) {
    return `${monthFmt.format(start).toUpperCase()} ${start.getDate()}–${end.getDate()}, ${yearFmt.format(end)}`;
  }
  return `${monthFmt.format(start).toUpperCase()} ${start.getDate()} – ${monthFmt.format(end).toUpperCase()} ${end.getDate()}, ${yearFmt.format(end)}`;
}

export function nextTourDate(dates: TourDateRow[]): TourDateRow | undefined {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = dates
    .filter((d) => d.start_date >= today)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  return upcoming[0] || dates[0];
}

export function useTours() {
  const [tours, setTours] = useState<TourRow[]>([]);
  const [availability, setAvailability] = useState<Record<string, AvailabilityRow>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [toursRes, datesRes, availRes] = await Promise.all([
          supabase.from("tours").select("*").eq("status", "published").order("sort_order", { ascending: true }),
          supabase.from("tour_dates").select("*").order("start_date", { ascending: true }),
          supabase.rpc("get_tour_availability"),
        ]);
        const { data: toursData, error: tErr } = toursRes;
        const { data: datesData, error: dErr } = datesRes;
        const { data: availData, error: aErr } = availRes;
        if (tErr) throw tErr;
        if (dErr) throw dErr;
        if (aErr) {
          // Availability is non-critical for rendering tour cards publicly.
          console.warn("get_tour_availability failed; rendering without live counts:", aErr);
        }
        if (cancelled) return;
        const datesByTour: Record<string, TourDateRow[]> = {};
        (datesData ?? []).forEach((d) => {
          const list = datesByTour[d.tour_id] || [];
          list.push(d as TourDateRow);
          datesByTour[d.tour_id] = list;
        });
        const combined: TourRow[] = (toursData ?? []).map((t) => ({
          ...(t as unknown as TourRow),
          dates: datesByTour[(t as { id: string }).id] || [],
        }));
        const availMap: Record<string, AvailabilityRow> = {};
        (availData ?? []).forEach((row) => {
          const r = row as AvailabilityRow;
          availMap[r.tour_date_id] = r;
        });
        setTours(combined);
        setAvailability(availMap);
      } catch (err) {
        console.error("useTours load failed:", err);
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { tours, availability, loading, error };
}