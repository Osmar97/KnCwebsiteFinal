import type { Language } from "@/pages/TourTranslations";
import { pickLocale, type AddonRow, type AvailableTourDateRow, type DestinationRow } from "@/hooks/usePrivateTourConfig";
import { SummaryRow } from "./Steps";
import { PriceSummary } from "./PriceSummary";
import { formatLongDate, tt, type T } from "./format";

interface Props {
  t: T;
  lang: Language;
  destination: DestinationRow | undefined;
  days: number;
  persons: number;
  startDate: AvailableTourDateRow | null;
  name: string;
  email: string;
  phone: string;
  selectedAddons: AddonRow[];
}

export function StepConfirm({
  t, lang, destination, days, persons, startDate, name, email, phone, selectedAddons,
}: Props) {
  return (
    <div>
      <h3 className="ptf-h2">{tt(t, "private_tour_flow.confirm.title", "Confirm your booking")}</h3>
      <p className="ptf-sub">{tt(t, "private_tour_flow.confirm.subtitle", "Review everything before paying your deposit.")}</p>

      <div className="ptf-summary-card">
        <div className="ptf-eyebrow">{tt(t, "private_tour_flow.confirm.summary", "Booking Summary")}</div>
        <SummaryRow label={tt(t, "private_tour_flow.exp.destination", "Destination")} value={destination ? pickLocale(destination as any, "label", lang) : "—"} />
        <SummaryRow label={tt(t, "private_tour_flow.confirm.duration", "Duration")} value={`${days} ${tt(t, "private_tour_flow.days", "days")}`} />
        <SummaryRow label={tt(t, "private_tour_flow.confirm.travellers", "Travellers")} value={`${persons} ${persons === 1 ? tt(t, "private_tour_flow.person", "person") : tt(t, "private_tour_flow.persons", "people")}`} />
        <SummaryRow label={tt(t, "private_tour_flow.dates.start_date", "Start date")} value={startDate ? formatLongDate(startDate.start_date, lang) : "—"} />
        <SummaryRow label={tt(t, "private_tour_flow.confirm.name", "Name")} value={name || "—"} />
        <SummaryRow label={tt(t, "private_tour_flow.confirm.email", "Email")} value={email || "—"} />
        <SummaryRow label="WhatsApp" value={phone || "—"} />
        {selectedAddons.length > 0 && (
          <SummaryRow
            label={tt(t, "private_tour_flow.exp.addons", "Add-ons")}
            value={selectedAddons.map((a) => pickLocale(a as any, "label", lang)).join(", ")}
          />
        )}
      </div>

      <PriceSummary destination={destination} days={days} persons={persons} selectedAddons={selectedAddons} t={t} />

      <div className="ptf-policy">
        {tt(t, "private_tour_flow.confirm.policy", "By proceeding, you agree to our cancellation policy: the 30% deposit is non-refundable within 30 days of the tour start date. Cancellations 30+ days before the tour receive a full deposit refund or credit toward a future date.")}
      </div>
    </div>
  );
}