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
  t: (path: string) => string;
  onJoinWaitlist: () => void;
}

export function TourGroupSection({ groupTours, availability, loading, lang, t, onJoinWaitlist }: Props) {
  return (
    <section className="group-section" id="group">
      <div className="t-container">
        <div className="section-eyebrow">Group Tours</div>
        <h2 className="section-title">Curated themed<br /><em>journeys</em></h2>
        <p className="section-desc">
          Join a curated group of 5–9 investors with shared interests. Preset themes, from coastal to cosmopolitan. We launch the trip when the group fills. Join the waitlist, attend your individual pre-trip call, and arrive ready to decide.
        </p>
        <Reveal>
          <div className="group-grid">
            {loading && <p style={{ opacity: 0.6 }}>Loading group tours…</p>}
            {!loading && groupTours.length === 0 && (
              <p style={{ opacity: 0.6 }}>No group tours announced yet. Check back soon.</p>
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
                .join(", ") + (tour.duration_days ? ` · ${tour.duration_days} Days` : "");
              const fillLabel = cap > 0
                ? `${filled}/${cap} spots filled`
                : "Waitlist open";
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
                    <strong>{fillLabel}</strong> — join the waitlist to lock your spot
                  </p>
                  <div className="gc-footer">
                    <div className="gc-price">
                      {formatPrice(tour.base_price, tour.currency)} <span>/ person</span>
                    </div>
                    <button className="btn-gold-outline" onClick={onJoinWaitlist}>
                      {next?.sold_out ? t("tour_modal.sold_out") : "Join Waitlist"}
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