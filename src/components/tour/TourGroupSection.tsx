import { Reveal } from "@/components/tour/Reveal";
import { formatPrice } from "@/lib/formatPrice";
import {
  nextTourDate,
  pickLocalized,
  type TourRow,
} from "@/hooks/useTours";
import { countryFromFlag } from "@/components/tour/tour-data";
import type { Language } from "@/pages/TourTranslations";

interface Props {
  groupTours: TourRow[];
  availability: Record<string, { remaining?: number; capacity?: number; confirmed_count?: number }>;
  loading: boolean;
  lang: Language;
  t: (path: string) => any;
  onJoinWaitlist: () => void;
}

export function TourGroupSection({ groupTours, availability, loading, lang, t, onJoinWaitlist }: Props) {
  return (
    <section className="group-section" id="group">
      <div className="t-container">
        <div className="section-eyebrow">{t("group_section.eyebrow")}</div>
        <h2 className="section-title">{t("group_section.title_1")}<br /><em>{t("group_section.title_2")}</em></h2>
        <p className="section-desc">{t("group_section.desc")}</p>
        <Reveal>
          <div className="group-grid">
            {loading && <p style={{ opacity: 0.6 }}>{t("group_section.loading")}</p>}
            {!loading && groupTours.length === 0 && (
              <p style={{ opacity: 0.6 }}>{t("group_section.empty")}</p>
            )}
            {groupTours.map((tour, idx) => {
              const next = nextTourDate(tour.dates);
              const avail = next ? availability[next.id] : undefined;
              const cap = avail?.capacity ?? next?.capacity ?? 0;
              const filled = avail?.confirmed_count ?? 0;
              const pct = cap > 0 ? Math.min((filled / cap) * 100, 100) : 0;
              const rec = tour as unknown as Record<string, unknown>;
              const localizedName = pickLocalized(rec, "name", lang);
              const num = String(idx + 1).padStart(2, "0");
              const destDetail = [tour.destinations?.[0], countryFromFlag(tour.flag)]
                .filter(Boolean)
                .join(", ") + (tour.duration_days ? ` · ${String(t("group_section.days")).replace("{n}", String(tour.duration_days))}` : "");
              const fillLabel = cap > 0
                ? String(t("group_section.filled_label")).replace("{filled}", String(filled)).replace("{cap}", String(cap))
                : t("group_section.waitlist_open");
              return (
                <div key={tour.id} className="group-card">
                  <div className="gc-num">{num}</div>
                  <span className="gc-theme">{tour.category}</span>
                  <div className="gc-name">{localizedName}</div>
                  <div className="gc-dest">{destDetail}</div>
                  <div className="gc-tags">
                    {tour.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="gc-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="wl-bar">
                    <div className="wl-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="wl-label">
                    <strong>{fillLabel}</strong> — {t("group_section.join_waitlist_note")}
                  </p>
                  <div className="gc-footer">
                    <div className="gc-price">
                      {formatPrice(tour.base_price, tour.currency)} <span>{t("group_section.per_person")}</span>
                    </div>
                    <button className="btn-gold-outline" onClick={onJoinWaitlist}>
                      {next?.sold_out ? t("tour_modal.sold_out") : t("group_section.join_waitlist")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}