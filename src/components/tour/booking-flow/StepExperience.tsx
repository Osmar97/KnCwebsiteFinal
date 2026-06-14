import type { Language } from "@/pages/TourTranslations";
import { pickLocale, type AddonRow, type DestinationRow } from "@/hooks/usePrivateTourConfig";
import { Label } from "./Steps";
import { PriceSummary } from "./PriceSummary";
import { fmtEur, tt, type T } from "./format";

interface Props {
  t: T;
  lang: Language;
  cfg: { destinations: DestinationRow[]; addons: AddonRow[]; included: any[] };
  destination: DestinationRow | undefined;
  destinationSlug: string;
  setDestinationSlug: (s: string) => void;
  days: number;
  setDays: (n: number) => void;
  persons: number;
  setPersons: (n: number) => void;
  selectedAddonSlugs: string[];
  toggleAddon: (slug: string) => void;
  selectedAddons: AddonRow[];
}

export function StepExperience({
  t, lang, cfg, destination, destinationSlug, setDestinationSlug,
  days, setDays, persons, setPersons, selectedAddonSlugs, toggleAddon, selectedAddons,
}: Props) {
  return (
    <div>
      <h3 className="ptf-h2">{tt(t, "private_tour_flow.exp.title", "Design your tour")}</h3>
      <p className="ptf-sub">{tt(t, "private_tour_flow.exp.subtitle", "Choose your destination, set the duration, and add what you need. The price updates as you go.")}</p>

      <Label>{tt(t, "private_tour_flow.exp.destination", "Destination")}</Label>
      <div className="ptf-dest-grid">
        {cfg.destinations.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`ptf-card ${destinationSlug === d.slug ? "is-active" : ""}`}
            onClick={() => { setDestinationSlug(d.slug); setDays(d.min_days); }}
          >
            <div className="ptf-flag">{d.flag}</div>
            <div className="ptf-card-title">{pickLocale(d as any, "label", lang)}</div>
            <div className="ptf-card-desc">{pickLocale(d as any, "desc", lang)}</div>
          </button>
        ))}
      </div>

      {destination && (
        <>
          <Label>
            {tt(t, "private_tour_flow.exp.duration", "Duration")} — {days} {days === 1 ? tt(t, "private_tour_flow.day", "day") : tt(t, "private_tour_flow.days", "days")}
          </Label>
          <div className="ptf-duration-row">
            <span className="ptf-mini-muted">{destination.min_days} {tt(t, "private_tour_flow.days_min", "days min")}</span>
            <input
              type="range"
              min={destination.min_days}
              max={destination.max_days}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="ptf-range"
            />
            <span className="ptf-mini-muted">{destination.max_days} {tt(t, "private_tour_flow.days_max", "days max")}</span>
          </div>
          <div className="ptf-day-chips">
            {Array.from({ length: destination.max_days - destination.min_days + 1 }, (_, i) => destination.min_days + i).map((n) => (
              <button
                key={n}
                type="button"
                className={`ptf-chip ${days === n ? "is-active" : ""}`}
                onClick={() => setDays(n)}
              >
                {n}d
              </button>
            ))}
          </div>

          <Label>{tt(t, "private_tour_flow.exp.persons", "Number of people")}</Label>
          <div className="ptf-persons-row">
            <button type="button" className="ptf-counter" onClick={() => setPersons(Math.max(destination.min_guests ?? 1, persons - 1))}>−</button>
            <span className="ptf-persons-value">{persons}</span>
            <button type="button" className="ptf-counter" onClick={() => setPersons(Math.min(destination.max_guests ?? 10, persons + 1))}>+</button>
            <span className="ptf-mini-muted">
              {persons === 1 ? tt(t, "private_tour_flow.person", "person") : tt(t, "private_tour_flow.persons", "people")} (max {destination.max_guests ?? 10} per group)
            </span>
          </div>

          <Label>
            {tt(t, "private_tour_flow.exp.addons", "Add-ons")} <span className="ptf-label-muted">— {tt(t, "private_tour_flow.optional", "optional")}</span>
          </Label>
          <div className="ptf-addons-grid">
            {cfg.addons.map((a) => {
              const active = selectedAddonSlugs.includes(a.slug);
              const noteLocal = pickLocale(a as any, "note", lang);
              const isComp = a.is_complimentary || Number(a.price) === 0;
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`ptf-card ptf-addon ${active ? "is-active" : ""}`}
                  onClick={() => toggleAddon(a.slug)}
                >
                  <div className="ptf-addon-head">
                    <span className="ptf-addon-icon">{a.icon}</span>
                    <span className={`ptf-addon-price ${active ? "is-active" : ""}`}>
                      {isComp ? (noteLocal || tt(t, "private_tour_flow.complimentary", "Complimentary")) : `+${fmtEur(Number(a.price) * persons)}`}
                    </span>
                  </div>
                  <div className="ptf-card-title">{pickLocale(a as any, "label", lang)}</div>
                  <div className="ptf-card-desc">{pickLocale(a as any, "desc", lang)}</div>
                </button>
              );
            })}
          </div>

          <div className="ptf-included">
            <div className="ptf-eyebrow">{tt(t, "private_tour_flow.always_included", "Always included")}</div>
            <div className="ptf-included-grid">
              {cfg.included.map((item) => (
                <div key={item.id} className="ptf-included-item">
                  <span className="ptf-included-check">✓</span>
                  <span>{pickLocale(item as any, "text", lang)}</span>
                </div>
              ))}
            </div>
          </div>

          <PriceSummary destination={destination} days={days} persons={persons} selectedAddons={selectedAddons} t={t} />
        </>
      )}
    </div>
  );
}