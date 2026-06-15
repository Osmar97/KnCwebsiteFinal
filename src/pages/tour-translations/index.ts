import { EN_TRANSLATIONS } from "./en/index";
import { PT_TRANSLATIONS } from "./pt/index";
import { FR_TRANSLATIONS } from "./fr/index";

export type Language = "en" | "pt" | "fr";

// EN is the canonical shape; other locales must mirror its top-level sections.
export type TourTranslations = typeof EN_TRANSLATIONS;

export const TRANSLATIONS: Record<Language, TourTranslations> = {
  en: EN_TRANSLATIONS,
  pt: PT_TRANSLATIONS as unknown as TourTranslations,
  fr: FR_TRANSLATIONS as unknown as TourTranslations,
};

export const SECTION_GROUPS = ["layout", "tours", "process", "forms", "flow"] as const;
export type SectionGroup = (typeof SECTION_GROUPS)[number];
