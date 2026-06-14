import { pickLocale, type AddonRow, type DestinationRow } from "@/hooks/usePrivateTourConfig";
import { computeDeposit } from "@/hooks/usePrivateTourBooking";
import { fmtEur, tt, type T } from "./format";

interface PriceSummaryProps {
  destination: DestinationRow | undefined;
  days: number;
  persons: number;
  selectedAddons: AddonRow[];
  compact?: boolean;
  t: T;
}

export function PriceSummary({ destination, days, persons, selectedAddons, compact, t }: PriceSummaryProps) {
  if (!destination || days < 1 || persons < 1) return null;
  const baseRate = Number(destination.base_price_per_day_per_person);
  const baseTotal = baseRate * days * persons;
  const extrasTotal = selectedAddons.reduce((s, a) => s + Number(a.price) * persons, 0);
  const total = baseTotal + extrasTotal;
  const deposit = computeDeposit(total);
  const balance = total - deposit;

  const personWord = persons === 1
    ? tt(t, "private_tour_flow.person", "person")
    : tt(t, "private_tour_flow.persons", "people");

  return (
    <div className={`ptf-price-summary ${compact ? "is-compact" : ""}`}>
      {!compact && <div className="ptf-eyebrow">{tt(t, "private_tour_flow.price_summary", "Price Summary")}</div>}
      <div className="ptf-price-row">
        <span className="ptf-price-muted">
          {tt(t, "private_tour_flow.base", "Base")} ({fmtEur(baseRate)}/{tt(t, "private_tour_flow.day", "day")} × {days} {days === 1 ? tt(t, "private_tour_flow.day", "day") : tt(t, "private_tour_flow.days", "days")} × {persons} {personWord})
        </span>
        <span className="ptf-price-value">{fmtEur(baseTotal)}</span>
      </div>
      {selectedAddons.map((a) => {
        if (Number(a.price) === 0) return null;
        return (
          <div key={a.id} className="ptf-price-row">
            <span className="ptf-price-muted">{pickLocale(a as any, "label", (a as any)._lang || "en") || a.label_en}</span>
            <span className="ptf-price-value">{fmtEur(Number(a.price) * persons)}</span>
          </div>
        );
      })}
      <div className="ptf-price-total">
        <span>{tt(t, "private_tour_flow.total", "Total")}</span>
        <span className="ptf-price-total-amount">{fmtEur(total)}</span>
      </div>
      <div className="ptf-price-deposit">
        <div className="ptf-price-row">
          <span className="ptf-price-muted">{tt(t, "private_tour_flow.deposit_label", "Deposit to reserve (30%)")}</span>
          <span className="ptf-price-gold">{fmtEur(deposit)}</span>
        </div>
        <div className="ptf-price-row">
          <span className="ptf-price-muted">{tt(t, "private_tour_flow.balance_label", "Balance due 14 days before tour")}</span>
          <span className="ptf-price-muted">{fmtEur(balance)}</span>
        </div>
      </div>
      {!compact && (
        <div className="ptf-price-note">
          {tt(t, "private_tour_flow.flights_note", "Flights excluded. Accommodation coordinated but not included in price.")}
        </div>
      )}
    </div>
  );
}