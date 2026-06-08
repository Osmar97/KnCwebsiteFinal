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
  t: (path: string) => string;
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
            { key: "all", label: "All Tours" },
            { key: "portugal", label: "Portugal" },
            { key: "cabo-verde", label: "Cabo Verde" },
            { key: "combined", label: "Combined" },
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
          {loading && <p style={{ opacity: 0.6 }}>Loading tours…</p>}
          {!loading && filteredTours.length === 0 && (
            <p style={{ opacity: 0.6 }}>No tours available right now. Check back soon.</p>
          )}
          {filteredTours.map((card, i) => {
            const next = nextTourDate(card.dates);
            const avail = next ? availability[next.id] : undefined;
            const remaining = avail?.remaining ?? next?.capacity ?? 0;
            const cap = avail?.capacity ?? next?.capacity ?? 0;
            const spotsText = !next ? "Coming soon"
              : next.sold_out ? "Sold out"
              : remaining <= 3 ? `${remaining} spots left`
              : `${remaining} spots`;
            const spotsFew = next ? (next.sold_out || remaining <= 3) : false;
            const price = formatPrice(card.base_price, card.currency);
            const dateLabel = next ? formatTourDateRange(next, localeMap[lang]) : "TBA";
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
                    <div className={`tour-spots ${spotsFew ? "few" : ""}`}>{spotsText}</div>
                  </div>
                  <div className="tour-body">
                    <div className="tour-loc">{card.destinations.slice(0, 2).join(" · ")}</div>
                    <div className="tour-title">{name}</div>
                    <p className="tour-desc">{shortDesc}</p>
                    <div className="tour-meta">
                      <span className="tour-pill">{card.duration_days} Days</span>
                      {cap > 0 && <span className="tour-pill">{cap} Participants</span>}
                      {card.tags[0] && <span className="tour-pill">{card.tags[0]}</span>}
                    </div>
                    <div className="tour-footer">
                      <div className="tour-price">
                        <strong>{price}</strong>
                        per person
                      </div>
                      <div className="tour-date">
                        {dateLabel}
                        <span>NEXT</span>
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