import { Reveal } from "@/components/tour/Reveal";
import { formatPrice } from "@/lib/formatPrice";
import {
  nextTourDate,
  formatTourDateRange,
  pickLocalized,
  type TourRow,
} from "@/hooks/useTours";
import { tourCategoryFilter } from "@/components/tour/tour-data";
import type { Language } from "@/pages/TourTranslations";

interface Props {
  tours: TourRow[];
  availability: Record<string, { remaining?: number; capacity?: number; confirmed_count?: number }>;
  loading: boolean;
  activeTab: string;
  setActiveTab: (k: string) => void;
  lang: Language;
  t: (path: string) => any;
  onSelectTour: (tour: TourRow) => void;
  onRequestCustom: () => void;
}

export function TourFeaturedTours({
  tours, availability, loading, activeTab, setActiveTab, lang, t, onSelectTour, onRequestCustom,
}: Props) {
  const filteredTours = activeTab === "all"
    ? tours
    : tours.filter((c) => tourCategoryFilter(c) === activeTab);

  const localeMap: Record<Language, string> = { en: "en-GB", pt: "pt-PT", fr: "fr-FR" };

  return (
    <section className="tours-section" id="tours">
      <div className="t-container">
        <div className="tours-header">
          <div>
            <div className="section-eyebrow">{t("tours_section.eyebrow")}</div>
            <h2 className="section-title">{t("tours_section.title_1")}<br /><em>{t("tours_section.title_2")}</em></h2>
          </div>
          <a href="#group" className="see-all">{t("tours_section.view_all")}</a>
        </div>
        <div className="tour-tabs">
          {[
            { key: "all", label: t("tours_section.tabs.all") },
            { key: "portugal", label: t("tours_section.tabs.portugal") },
            { key: "cabo-verde", label: t("tours_section.tabs.cabo_verde") },
            { key: "combined", label: t("tours_section.tabs.combined") },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`ttab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tours-grid">
          {loading && <p style={{ opacity: 0.6 }}>{t("tours_section.loading")}</p>}
          {!loading && filteredTours.length === 0 && (
            <p style={{ opacity: 0.6 }}>{t("tours_section.empty")}</p>
          )}
          {filteredTours.map((card, i) => {
            const next = nextTourDate(card.dates);
            const avail = next ? availability[next.id] : undefined;
            const cap = avail?.capacity ?? next?.capacity ?? 0;
            const filled = avail?.confirmed_count ?? 0;
            const remaining = avail?.remaining ?? Math.max(cap - filled, 0);
            const pct = cap > 0 ? Math.min((filled / cap) * 100, 100) : 0;
            const spotsText = !next ? t("tours_section.card.coming_soon")
              : next.sold_out ? t("tours_section.card.sold_out")
              : remaining <= 3 ? String(t("tours_section.card.spots_left")).replace("{n}", String(remaining))
              : String(t("tours_section.card.spots")).replace("{n}", String(remaining));
            const spotsFew = next ? (next.sold_out || remaining <= 3) : false;
            const filledText = String(t("tour_modal.spots_filled"))
              .replace("{filled}", String(filled))
              .replace("{total}", String(cap));
            const price = formatPrice(card.base_price, card.currency);
            const dateLabel = next ? formatTourDateRange(next, localeMap[lang]) : t("tours_section.card.tba");
            const cardRec = card as unknown as Record<string, unknown>;
            const name = pickLocalized(cardRec, "name", lang);
            const shortDesc = pickLocalized(cardRec, "short_desc", lang);
            const openModal = () => onSelectTour(card);
            return (
              <Reveal key={card.id} delay={i * 0.05}>
                <div className="tour-card" onClick={openModal} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openModal()}>
                  <div className="tour-img">
                    <div className={`tour-img-inner ${card.hero_image || ""}`} />
                    {card.badge && <div className={`tour-badge ${card.badge_variant === "gold" ? "gold" : ""}`}>{card.badge}</div>}
                    {card.flag && <div className="tour-flag">{card.flag}</div>}
                    {next && cap > 0 ? (
                      <div className={`tour-img-availability ${spotsFew ? "few" : ""}`}>
                        <div
                          className="tour-img-progress"
                          role="progressbar"
                          aria-valuenow={filled}
                          aria-valuemin={0}
                          aria-valuemax={cap}
                          aria-label={filledText}
                        >
                          <div className="tour-img-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="tour-img-progress-text">
                          <span className="tour-img-progress-count">{remaining} / {cap}</span>
                          <span className="tour-img-progress-label">{spotsText}</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`tour-spots ${spotsFew ? "few" : ""}`}>{spotsText}</div>
                    )}
                  </div>
                  <div className="tour-body">
                    <div className="tour-loc">{card.destinations.slice(0, 2).join(" · ")}</div>
                    <div className="tour-title">{name}</div>
                    <p className="tour-desc">{shortDesc}</p>
                    <div className="tour-meta">
                      <span className="tour-pill">{String(t("tours_section.card.days")).replace("{n}", String(card.duration_days))}</span>
                      {cap > 0 && <span className="tour-pill">{String(t("tours_section.card.participants")).replace("{n}", String(cap))}</span>}
                      {card.tags[0] && <span className="tour-pill">{card.tags[0]}</span>}
                    </div>
                    <div className="tour-footer">
                      <div className="tour-price">
                        <strong>{price}</strong>
                        {t("tours_section.card.per_person")}
                      </div>
                      <div className="tour-date">
                        {dateLabel}
                        <span>{t("tours_section.card.next")}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tour-request-custom"
                      onClick={(e) => { e.stopPropagation(); onRequestCustom(); }}
                    >
                      {t("tours_section.request_custom")}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}