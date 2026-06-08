import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { TourRow, AvailabilityRow } from "@/hooks/useTours";
import { pickLocalized, nextTourDate, formatTourDateRange } from "@/hooks/useTours";
import type { Language } from "@/pages/TourTranslations";
import { formatPrice } from "@/lib/formatPrice";

interface Props {
  tour: TourRow | null;
  availability: Record<string, AvailabilityRow>;
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinWaitlist: () => void;
  labels: {
    destinations: string;
    nextDate: string;
    spotsFilled: (filled: number, total: number) => string;
    remaining: (n: number) => string;
    from: string;
    perPerson: string;
    joinWaitlist: string;
    close: string;
    soldOut: string;
  };
}

export default function TourDetailModal({ tour, availability, lang, open, onOpenChange, onJoinWaitlist, labels }: Props) {
  if (!tour) return null;

  const next = nextTourDate(tour.dates);
  const avail = next ? availability[next.id] : undefined;
  const capacity = avail?.capacity ?? next?.capacity ?? 0;
  const filled = avail?.confirmed_count ?? 0;
  const remaining = avail?.remaining ?? Math.max(capacity - filled, 0);
  const pct = capacity > 0 ? Math.min((filled / capacity) * 100, 100) : 0;
  const price = formatPrice(tour.base_price, tour.currency);

  const tourRec = tour as unknown as Record<string, unknown>;
  const name = pickLocalized(tourRec, "name", lang);
  const description = pickLocalized(tourRec, "description", lang) || pickLocalized(tourRec, "short_desc", lang);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tour-detail-modal" aria-label={name}>
        <button
          type="button"
          className="tdm-close"
          onClick={() => onOpenChange(false)}
          aria-label={labels.close}
        >
          <X size={18} />
        </button>

        <div className="tdm-eyebrow">{tour.category.toUpperCase()}</div>
        <h2 className="tdm-title">{name}</h2>
        <p className="tdm-desc">{description}</p>

        <div className="tdm-pills">
          <span className="tdm-pill">{tour.duration_days} DAYS</span>
          {tour.tags.slice(0, 3).map((t) => (
            <span key={t} className="tdm-pill">{t.toUpperCase()}</span>
          ))}
        </div>

        {tour.destinations.length > 0 && (
          <div className="tdm-row">
            <span className="tdm-row-label">{labels.destinations}</span>
            <span className="tdm-row-value">{tour.destinations.join(" · ")}</span>
          </div>
        )}

        {next && (
          <div className="tdm-row">
            <span className="tdm-row-label">{labels.nextDate}</span>
            <span className="tdm-row-value">{formatTourDateRange(next, lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : "fr-FR")}</span>
          </div>
        )}

        {next && capacity > 0 && (
          <>
            <div className="tdm-progress" role="progressbar" aria-valuenow={filled} aria-valuemin={0} aria-valuemax={capacity}>
              <div className="tdm-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="tdm-progress-text">
              {labels.spotsFilled(filled, capacity)} <span className="tdm-remaining">{labels.remaining(remaining)}</span>
            </p>
          </>
        )}

        <div className="tdm-footer">
          <div className="tdm-price">
            <div className="tdm-price-label">{labels.from}</div>
            <div className="tdm-price-value">{price}</div>
          </div>
          <button
            type="button"
            className="tdm-cta"
            onClick={onJoinWaitlist}
            disabled={next?.sold_out}
          >
            {next?.sold_out ? labels.soldOut : labels.joinWaitlist}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}