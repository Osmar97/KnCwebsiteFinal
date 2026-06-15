import type { Language } from "@/pages/TourTranslations";

export type T = (path: string) => any;

export function fmtEur(n: number) {
  return Math.round(n).toLocaleString("pt-PT") + "\u00a0€";
}

export function formatLongDate(iso: string, lang: Language): string {
  const d = new Date(iso);
  const locale = lang === "pt" ? "pt-PT" : lang === "fr" ? "fr-FR" : "en-GB";
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

export function formatSlot(iso: string, lang: Language): string {
  const d = new Date(iso);
  const locale = lang === "pt" ? "pt-PT" : lang === "fr" ? "fr-FR" : "en-GB";
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }) +
    " — " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

export function tt(t: T, key: string, fallback: string): string {
  const v = t(key);
  if (typeof v === "string" && v !== key) return v;
  return fallback;
}