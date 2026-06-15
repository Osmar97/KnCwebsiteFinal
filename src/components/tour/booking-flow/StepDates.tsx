import type { Language } from "@/pages/TourTranslations";
import type { AddonRow, AvailableTourDateRow, DestinationRow } from "@/hooks/usePrivateTourConfig";
import { PriceSummary } from "./PriceSummary";
import { formatLongDate, tt, type T } from "./format";

interface Props {
  t: T;
  lang: Language;
  tourDates: AvailableTourDateRow[];
  days: number;
  persons: number;
  startDateId: string | null;
  setStartDateId: (id: string) => void;
  startDate: AvailableTourDateRow | null;
  destination: DestinationRow | undefined;
  selectedAddons: AddonRow[];
}

export function StepDates({
  t, lang, tourDates, days, persons, startDateId, setStartDateId, startDate, destination, selectedAddons,
}: Props) {
  return (
    <div>
      <h3 className="ptf-h2">{tt(t, "private_tour_flow.dates.title", "Choose your start date")}</h3>
      <p className="ptf-sub">
        {tt(t, "private_tour_flow.dates.subtitle_a", "Select from available tour dates below. Duration:")} <strong className="ptf-strong-gold">{days} {tt(t, "private_tour_flow.days", "days")}</strong>.
      </p>
      <p className="ptf-sub-small">
        {tt(t, "private_tour_flow.dates.subtitle_b", "Dates are managed manually — if none work, book a clarity call and we'll find something that does.")}
      </p>

      <div className="ptf-dates-grid">
        {tourDates.length === 0 && (
          <p className="ptf-price-muted">{tt(t, "private_tour_flow.dates.empty", "No published dates yet — book a clarity call below and we'll arrange one for you.")}</p>
        )}
        {tourDates.map((d) => {
          const start = new Date(d.start_date);
          const end = new Date(start);
          end.setDate(end.getDate() + days - 1);
          const isSelected = startDateId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              className={`ptf-card ptf-date-card ${isSelected ? "is-active" : ""}`}
              onClick={() => setStartDateId(d.id)}
              disabled={d.sold_out}
            >
              <div className={`ptf-mini-eyebrow ${isSelected ? "is-active" : ""}`}>
                {tt(t, "private_tour_flow.dates.start_date", "Start date")}
              </div>
              <div className="ptf-date-main">{formatLongDate(d.start_date, lang)}</div>
              <div className="ptf-card-desc">
                {tt(t, "private_tour_flow.dates.ends", "Ends")}: {formatLongDate(end.toISOString().slice(0, 10), lang)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="ptf-callout">
        <span className="ptf-callout-icon">📅</span>
        <div className="ptf-callout-text">
          <div className="ptf-callout-title">{tt(t, "private_tour_flow.dates.cta_title", "None of these work?")}</div>
          <div className="ptf-card-desc">{tt(t, "private_tour_flow.dates.cta_desc", "Book a free 15-min clarity call and we'll find a date that fits. No commitment required.")}</div>
        </div>
        <a href="https://kingsncompany.setmore.com" target="_blank" rel="noreferrer" className="ptf-callout-btn">
          {tt(t, "private_tour_flow.dates.book_call", "Book a call")}
        </a>
      </div>

      {startDate && (
        <div className="ptf-mt-24">
          <PriceSummary destination={destination} days={days} persons={persons} selectedAddons={selectedAddons} compact t={t} />
        </div>
      )}
    </div>
  );
}