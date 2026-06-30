import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CrmSource, CrmStatus } from "@/lib/crm";

export interface BookingRow {
  id: string;
  tour_date_id: string | null;
  status: string | null;
  amount_paid: number | null;
  currency: string | null;
  customer_email: string | null;
  source: string | null;
  created_at: string;
}

export interface QuoteRow {
  id: string;
  email: string | null;
  country: string | null;
  nationality: string | null;
  destinations: string[] | null;
  destination_slug: string | null;
  status: string | null;
  total_amount: number | null;
  deposit_amount: number | null;
  payment_status: string | null;
  currency: string | null;
  created_at: string;
}

export interface WaitlistRow {
  id: string;
  email: string | null;
  country: string | null;
  status: string | null;
  created_at: string;
}

export interface ContactRow {
  id: string;
  email: string | null;
  status: string | null;
  created_at: string;
}

export interface TourRow {
  id: string;
  slug: string;
  name_en: string;
  status: string;
  destinations: string[] | null;
  base_price: number | null;
  currency: string | null;
}

export interface TourDateRow {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  capacity: number;
  sold_out: boolean | null;
}

export interface CrmMetaRow {
  id: string;
  source: CrmSource;
  source_id: string;
  status: CrmStatus;
  country: string | null;
}

export interface AnalyticsData {
  bookings: BookingRow[];
  quotes: QuoteRow[];
  waitlist: WaitlistRow[];
  contacts: ContactRow[];
  tours: TourRow[];
  tourDates: TourDateRow[];
  crmMeta: CrmMetaRow[];
}

export const useAnalyticsData = () =>
  useQuery({
    queryKey: ["admin-analytics-data"],
    staleTime: 1000 * 60 * 2,
    queryFn: async (): Promise<AnalyticsData> => {
      const [b, q, w, c, t, d, m] = await Promise.all([
        supabase.from("tour_bookings").select("id,tour_date_id,status,amount_paid,currency,customer_email,source,created_at").limit(5000),
        supabase.from("tour_custom_quote_requests").select("id,email,country,nationality,destinations,destination_slug,status,total_amount,deposit_amount,payment_status,currency,created_at").limit(5000),
        supabase.from("tour_waitlist_requests").select("id,email,country,status,created_at").limit(5000),
        supabase.from("contact_submissions").select("id,email,status,created_at").limit(5000),
        supabase.from("tours").select("id,slug,name_en,status,destinations,base_price,currency").limit(1000),
        supabase.from("tour_dates").select("id,tour_id,start_date,end_date,capacity,sold_out").limit(2000),
        supabase.from("crm_lead_metadata").select("id,source,source_id,status,country").limit(5000),
      ]);
      const err = b.error || q.error || w.error || c.error || t.error || d.error || m.error;
      if (err) throw err;
      return {
        bookings: (b.data ?? []) as BookingRow[],
        quotes: (q.data ?? []) as QuoteRow[],
        waitlist: (w.data ?? []) as WaitlistRow[],
        contacts: (c.data ?? []) as ContactRow[],
        tours: (t.data ?? []) as TourRow[],
        tourDates: (d.data ?? []) as TourDateRow[],
        crmMeta: (m.data ?? []) as CrmMetaRow[],
      };
    },
  });

export interface AnalyticsFilters {
  start?: string | null; // ISO date
  end?: string | null;
  tourId?: string | null;
  destination?: string | null;
  country?: string | null;
  source?: "all" | "booking" | "quote" | "waitlist" | "contact";
  status?: string | null;
}

export const defaultFilters: AnalyticsFilters = {
  start: null,
  end: null,
  tourId: null,
  destination: null,
  country: null,
  source: "all",
  status: null,
};

const inRange = (iso: string, start?: string | null, end?: string | null) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (start && t < new Date(start).getTime()) return false;
  if (end && t > new Date(end).getTime() + 24 * 3600 * 1000 - 1) return false;
  return true;
};

export interface ComputedAnalytics {
  // Revenue
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowthPct: number | null;
  avgBookingValue: number;
  depositsCollected: number;
  outstandingRevenue: number;
  currency: string;
  // Time series
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  revenueByDestination: Array<{ name: string; revenue: number }>;
  revenueByTour: Array<{ name: string; revenue: number }>;
  revenueByCountry: Array<{ name: string; revenue: number }>;
  revenueBySource: Array<{ name: string; revenue: number }>;
  // Tour analytics
  tourPerf: Array<{
    tourId: string;
    name: string;
    capacity: number;
    booked: number;
    remaining: number;
    occupancy: number;
    waitlist: number;
    conversion: number;
    revenue: number;
  }>;
  // Leads
  leadsByMonth: Array<{ month: string; leads: number }>;
  leadsBySource: Array<{ name: string; leads: number; qualified: number; bookings: number; revenue: number; conversion: number }>;
  bookingsByMonth: Array<{ month: string; bookings: number }>;
  // Funnel
  funnel: Array<{ stage: string; count: number }>;
  // Totals
  totalLeads: number;
  qualifiedLeads: number;
  totalBookings: number;
  conversionRate: number;
  mostPopularDestination: string | null;
  activeTours: number;
  avgOccupancy: number;
}

const monthKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const useComputedAnalytics = (filters: AnalyticsFilters): { data: ComputedAnalytics | null; isLoading: boolean; error: unknown } => {
  const q = useAnalyticsData();

  const computed = useMemo<ComputedAnalytics | null>(() => {
    if (!q.data) return null;
    const { bookings, quotes, waitlist, contacts, tours, tourDates, crmMeta } = q.data;

    const tourById = new Map(tours.map((t) => [t.id, t]));
    const dateById = new Map(tourDates.map((d) => [d.id, d]));

    const matchTourFilter = (tourId: string | null | undefined) => {
      if (!filters.tourId) return true;
      return tourId === filters.tourId;
    };
    const matchDestination = (dests: (string | null | undefined)[]) => {
      if (!filters.destination) return true;
      return dests.some((x) => x && x.toLowerCase() === filters.destination!.toLowerCase());
    };
    const matchCountry = (c: string | null | undefined) => {
      if (!filters.country) return true;
      return (c ?? "").toLowerCase() === filters.country.toLowerCase();
    };

    // Filter bookings
    const fBookings = bookings.filter((b) => {
      if (!inRange(b.created_at, filters.start, filters.end)) return false;
      const td = b.tour_date_id ? dateById.get(b.tour_date_id) : null;
      const tour = td ? tourById.get(td.tour_id) : null;
      if (!matchTourFilter(tour?.id ?? null)) return false;
      if (filters.destination && !matchDestination(tour?.destinations ?? [])) return false;
      if (filters.source && filters.source !== "all" && filters.source !== "booking") return false;
      return true;
    });

    const fQuotes = quotes.filter((qr) => {
      if (!inRange(qr.created_at, filters.start, filters.end)) return false;
      if (filters.destination && !matchDestination([...(qr.destinations ?? []), qr.destination_slug ?? null])) return false;
      if (!matchCountry(qr.country ?? qr.nationality ?? null)) return false;
      if (filters.source && filters.source !== "all" && filters.source !== "quote") return false;
      if (filters.status && qr.status !== filters.status) return false;
      return true;
    });

    const fWaitlist = waitlist.filter((w) => {
      if (!inRange(w.created_at, filters.start, filters.end)) return false;
      if (!matchCountry(w.country)) return false;
      if (filters.source && filters.source !== "all" && filters.source !== "waitlist") return false;
      return true;
    });

    const fContacts = contacts.filter((c) => {
      if (!inRange(c.created_at, filters.start, filters.end)) return false;
      if (filters.source && filters.source !== "all" && filters.source !== "contact") return false;
      return true;
    });

    // Booking-level revenue (paid)
    const paidBookings = fBookings.filter((b) => (b.status ?? "").toLowerCase() === "confirmed");
    const bookingRevenue = paidBookings.reduce((s, b) => s + (Number(b.amount_paid) || 0), 0);
    // Quote revenue (paid via stripe)
    const paidQuotes = fQuotes.filter((q) => (q.payment_status ?? "").toLowerCase() === "paid");
    const quoteRevenue = paidQuotes.reduce((s, q) => s + (Number(q.total_amount) || 0), 0);
    const totalRevenue = bookingRevenue + quoteRevenue;

    const now = new Date();
    const ym = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const thisMonth = ym(now);
    const last = new Date(now);
    last.setUTCMonth(last.getUTCMonth() - 1);
    const lastMonth = ym(last);
    const revAtMonth = (mk: string) => {
      const a = paidBookings.filter((b) => monthKey(b.created_at) === mk).reduce((s, b) => s + (Number(b.amount_paid) || 0), 0);
      const c = paidQuotes.filter((q) => monthKey(q.created_at) === mk).reduce((s, q) => s + (Number(q.total_amount) || 0), 0);
      return a + c;
    };
    const revenueThisMonth = revAtMonth(thisMonth);
    const revenueLastMonth = revAtMonth(lastMonth);
    const revenueGrowthPct = revenueLastMonth === 0 ? (revenueThisMonth > 0 ? null : 0) : ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

    const totalPaidCount = paidBookings.length + paidQuotes.length;
    const avgBookingValue = totalPaidCount ? totalRevenue / totalPaidCount : 0;

    const depositsCollected = fQuotes.reduce((s, q) => s + (Number(q.deposit_amount) || 0), 0);
    const outstandingRevenue = fQuotes
      .filter((q) => (q.payment_status ?? "").toLowerCase() !== "paid")
      .reduce((s, q) => s + Math.max(0, (Number(q.total_amount) || 0) - (Number(q.deposit_amount) || 0)), 0);

    const currency = fBookings[0]?.currency ?? fQuotes[0]?.currency ?? "EUR";

    // Monthly revenue (last 12 months)
    const monthly: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now);
      dt.setUTCMonth(dt.getUTCMonth() - i);
      monthly[ym(dt)] = 0;
    }
    for (const b of paidBookings) {
      const k = monthKey(b.created_at);
      if (k in monthly) monthly[k] += Number(b.amount_paid) || 0;
    }
    for (const qr of paidQuotes) {
      const k = monthKey(qr.created_at);
      if (k in monthly) monthly[k] += Number(qr.total_amount) || 0;
    }
    const monthlyRevenue = Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }));

    // Revenue by destination/tour/country/source
    const destMap: Record<string, number> = {};
    const tourMap: Record<string, number> = {};
    const countryMap: Record<string, number> = {};
    const srcMap: Record<string, number> = { Tour: 0, "Custom Quote": 0 };

    for (const b of paidBookings) {
      const td = b.tour_date_id ? dateById.get(b.tour_date_id) : null;
      const tour = td ? tourById.get(td.tour_id) : null;
      const amt = Number(b.amount_paid) || 0;
      srcMap.Tour += amt;
      if (tour) {
        tourMap[tour.name_en] = (tourMap[tour.name_en] || 0) + amt;
        for (const d of tour.destinations ?? []) destMap[d] = (destMap[d] || 0) + amt;
      }
    }
    for (const qr of paidQuotes) {
      const amt = Number(qr.total_amount) || 0;
      srcMap["Custom Quote"] += amt;
      const c = qr.country ?? qr.nationality;
      if (c) countryMap[c] = (countryMap[c] || 0) + amt;
      const dests = [...(qr.destinations ?? []), qr.destination_slug].filter(Boolean) as string[];
      for (const d of dests) destMap[d] = (destMap[d] || 0) + amt;
    }

    const sortDesc = (m: Record<string, number>) =>
      Object.entries(m)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);

    // Tour performance
    const datesByTour: Record<string, TourDateRow[]> = {};
    for (const d of tourDates) (datesByTour[d.tour_id] ||= []).push(d);

    const waitlistInterest = fWaitlist.length; // not per-tour at table level
    const tourPerf = tours
      .filter((t) => !filters.tourId || t.id === filters.tourId)
      .filter((t) => !filters.destination || (t.destinations ?? []).some((d) => d.toLowerCase() === filters.destination!.toLowerCase()))
      .map((t) => {
        const ds = datesByTour[t.id] ?? [];
        const capacity = ds.reduce((s, d) => s + (d.capacity || 0), 0);
        const tourBookings = paidBookings.filter((b) => {
          const td = b.tour_date_id ? dateById.get(b.tour_date_id) : null;
          return td?.tour_id === t.id;
        });
        const booked = tourBookings.length;
        const remaining = Math.max(0, capacity - booked);
        const occupancy = capacity ? (booked / capacity) * 100 : 0;
        const revenue = tourBookings.reduce((s, b) => s + (Number(b.amount_paid) || 0), 0);
        // conversion: bookings / (waitlist + quote interest for this tour's destinations)
        const interest = fQuotes.filter((q) =>
          (q.destinations ?? []).some((d) => (t.destinations ?? []).map((x) => x.toLowerCase()).includes(d.toLowerCase())) ||
          (q.destination_slug && (t.destinations ?? []).map((x) => x.toLowerCase()).includes(q.destination_slug.toLowerCase())),
        ).length;
        const denom = booked + interest + waitlistInterest;
        const conversion = denom ? (booked / denom) * 100 : 0;
        return {
          tourId: t.id,
          name: t.name_en,
          capacity,
          booked,
          remaining,
          occupancy,
          waitlist: waitlistInterest,
          conversion,
          revenue,
        };
      });

    // Leads
    const allLeadsRows = [
      ...fWaitlist.map((r) => ({ src: "Waitlist", id: r.id, created_at: r.created_at, email: r.email })),
      ...fQuotes.map((r) => ({ src: "Custom Quote", id: r.id, created_at: r.created_at, email: r.email })),
      ...fContacts.map((r) => ({ src: "Contact Form", id: r.id, created_at: r.created_at, email: r.email })),
    ];

    const leadMonthly: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now);
      dt.setUTCMonth(dt.getUTCMonth() - i);
      leadMonthly[ym(dt)] = 0;
    }
    for (const l of allLeadsRows) {
      const k = monthKey(l.created_at);
      if (k in leadMonthly) leadMonthly[k] += 1;
    }
    const leadsByMonth = Object.entries(leadMonthly).map(([month, leads]) => ({ month, leads }));

    const bookingMonthly: Record<string, number> = { ...Object.fromEntries(Object.keys(leadMonthly).map((k) => [k, 0])) };
    for (const b of fBookings) {
      const k = monthKey(b.created_at);
      if (k in bookingMonthly) bookingMonthly[k] += 1;
    }
    const bookingsByMonth = Object.entries(bookingMonthly).map(([month, bookings]) => ({ month, bookings }));

    // Status map for CRM
    const metaByKey = new Map<string, CrmMetaRow>();
    for (const m of crmMeta) metaByKey.set(`${m.source}:${m.source_id}`, m);
    const statusOf = (source: CrmSource, id: string): CrmStatus => (metaByKey.get(`${source}:${id}`)?.status as CrmStatus) ?? "new";

    const qualifiedStatuses: CrmStatus[] = ["qualified", "proposal_sent", "tour_booked", "closed_won", "discovery_completed"];
    const wonStatuses: CrmStatus[] = ["closed_won", "tour_booked"];

    const buildSourceStats = (label: string, source: CrmSource, rows: Array<{ id: string; created_at: string; email: string | null }>, revenue: number) => {
      const total = rows.length;
      const qualified = rows.filter((r) => qualifiedStatuses.includes(statusOf(source, r.id))).length;
      const won = rows.filter((r) => wonStatuses.includes(statusOf(source, r.id))).length;
      return {
        name: label,
        leads: total,
        qualified,
        bookings: won,
        revenue,
        conversion: total ? (won / total) * 100 : 0,
      };
    };

    const leadsBySource = [
      buildSourceStats("Waitlist", "waitlist", fWaitlist, 0),
      buildSourceStats("Custom Quote", "quote", fQuotes, quoteRevenue),
      buildSourceStats("Contact Form", "contact", fContacts, 0),
      { name: "Tour Booking", leads: fBookings.length, qualified: paidBookings.length, bookings: paidBookings.length, revenue: bookingRevenue, conversion: fBookings.length ? (paidBookings.length / fBookings.length) * 100 : 0 },
    ];

    // Funnel
    const allLeads = fWaitlist.length + fQuotes.length + fContacts.length;
    const allMeta = crmMeta.filter((m) => {
      // restrict to filtered IDs
      if (m.source === "waitlist") return fWaitlist.some((x) => x.id === m.source_id);
      if (m.source === "quote") return fQuotes.some((x) => x.id === m.source_id);
      if (m.source === "contact") return fContacts.some((x) => x.id === m.source_id);
      return false;
    });
    const countStatus = (statuses: CrmStatus[]) => allMeta.filter((m) => statuses.includes(m.status)).length;
    const funnel = [
      { stage: "Leads", count: allLeads },
      { stage: "Contacted", count: countStatus(["contacted", "discovery_scheduled", "discovery_completed", "qualified", "proposal_sent", "tour_booked", "closed_won"]) },
      { stage: "Qualified", count: countStatus(["qualified", "proposal_sent", "tour_booked", "closed_won"]) },
      { stage: "Discovery Call", count: countStatus(["discovery_completed", "qualified", "proposal_sent", "tour_booked", "closed_won"]) },
      { stage: "Tour Booked", count: countStatus(["tour_booked", "closed_won"]) + paidBookings.length },
      { stage: "Tour Attended", count: paidBookings.filter((b) => b.tour_date_id && dateById.get(b.tour_date_id) && new Date(dateById.get(b.tour_date_id)!.end_date) < now).length },
      { stage: "Property Purchased", count: countStatus(["closed_won"]) },
    ];

    // Aggregate destination ranking
    const revenueByDestination = sortDesc(destMap);
    const mostPopularDestination = revenueByDestination[0]?.name ?? null;

    const totalLeads = allLeads;
    const qualifiedLeads = countStatus(qualifiedStatuses);
    const totalBookings = fBookings.length;
    const conversionRate = totalLeads ? (paidBookings.length / totalLeads) * 100 : 0;
    const activeTours = tours.filter((t) => t.status === "published").length;
    const avgOccupancy = tourPerf.length ? tourPerf.reduce((s, t) => s + t.occupancy, 0) / tourPerf.length : 0;

    return {
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowthPct,
      avgBookingValue,
      depositsCollected,
      outstandingRevenue,
      currency,
      monthlyRevenue,
      revenueByDestination,
      revenueByTour: sortDesc(tourMap),
      revenueByCountry: sortDesc(countryMap),
      revenueBySource: sortDesc(srcMap),
      tourPerf,
      leadsByMonth,
      leadsBySource,
      bookingsByMonth,
      funnel,
      totalLeads,
      qualifiedLeads,
      totalBookings,
      conversionRate,
      mostPopularDestination,
      activeTours,
      avgOccupancy,
    };
  }, [q.data, filters]);

  return { data: computed, isLoading: q.isLoading, error: q.error };
};

export const formatCurrency = (v: number, currency = "EUR") => {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 0 }).format(v || 0);
  } catch {
    return `${(v || 0).toFixed(0)} ${currency}`;
  }
};