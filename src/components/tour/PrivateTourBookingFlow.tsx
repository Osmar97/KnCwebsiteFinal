import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Language } from "@/pages/TourTranslations";
import {
  usePrivateTourConfig,
  pickLocale,
  type AddonRow,
  type DestinationRow,
  type AvailableTourDateRow,
  type ClarityCallSlotRow,
} from "@/hooks/usePrivateTourConfig";

type T = (path: string) => any;

interface Props {
  t: T;
  lang: Language;
}

function fmtEur(n: number) {
  return Math.round(n).toLocaleString("pt-PT") + "\u00a0€";
}

function formatLongDate(iso: string, lang: Language): string {
  const d = new Date(iso);
  const locale = lang === "pt" ? "pt-PT" : lang === "fr" ? "fr-FR" : "en-GB";
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function formatSlot(iso: string, lang: Language): string {
  const d = new Date(iso);
  const locale = lang === "pt" ? "pt-PT" : lang === "fr" ? "fr-FR" : "en-GB";
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" }) +
    " — " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function tt(t: T, key: string, fallback: string): string {
  const v = t(key);
  if (typeof v === "string" && v !== key) return v;
  return fallback;
}

// ─── PRESENTATIONAL HELPERS ──────────────────────────────────────────────

function Steps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="ptf-steps">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className={`ptf-step ${i < labels.length - 1 ? "ptf-step-flex" : ""}`}>
            <div className="ptf-step-marker">
              <div className={`ptf-step-circle ${done ? "is-done" : active ? "is-active" : ""}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`ptf-step-label ${active ? "is-active" : done ? "is-done" : ""}`}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`ptf-step-line ${done ? "is-done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="ptf-label">{children}</div>;
}

interface PriceSummaryProps {
  destination: DestinationRow | undefined;
  days: number;
  persons: number;
  selectedAddons: AddonRow[];
  compact?: boolean;
  t: T;
}

function PriceSummary({ destination, days, persons, selectedAddons, compact, t }: PriceSummaryProps) {
  if (!destination || days < 1 || persons < 1) return null;
  const baseRate = Number(destination.base_price_per_day_per_person);
  const baseTotal = baseRate * days * persons;
  const extrasTotal = selectedAddons.reduce((s, a) => s + Number(a.price) * persons, 0);
  const total = baseTotal + extrasTotal;
  const deposit = Math.round(total * 0.3);
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────

export default function PrivateTourBookingFlow({ t, lang }: Props) {
  const cfg = usePrivateTourConfig();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<"pay" | "call" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isBookingCall, setIsBookingCall] = useState(false);

  const [destinationSlug, setDestinationSlug] = useState<string>("");
  const [days, setDays] = useState(3);
  const [persons, setPersons] = useState(2);
  const [selectedAddonSlugs, setSelectedAddonSlugs] = useState<string[]>([]);
  const [startDateId, setStartDateId] = useState<string | null>(null);
  const [callSlotId, setCallSlotId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  const destination = useMemo(
    () => cfg.destinations.find((d) => d.slug === destinationSlug),
    [cfg.destinations, destinationSlug],
  );
  const selectedAddons = useMemo(
    () => cfg.addons.filter((a) => selectedAddonSlugs.includes(a.slug)),
    [cfg.addons, selectedAddonSlugs],
  );
  const startDate = useMemo(
    () => cfg.tourDates.find((d) => d.id === startDateId) ?? null,
    [cfg.tourDates, startDateId],
  );

  const totalPrice = useMemo(() => {
    if (!destination) return 0;
    const base = Number(destination.base_price_per_day_per_person) * days * persons;
    const extras = selectedAddons.reduce((s, a) => s + Number(a.price) * persons, 0);
    return base + extras;
  }, [destination, days, persons, selectedAddons]);
  const deposit = Math.round(totalPrice * 0.3);

  const stepLabels = [
    tt(t, "private_tour_flow.steps.experience", "Experience"),
    tt(t, "private_tour_flow.steps.dates", "Dates"),
    tt(t, "private_tour_flow.steps.details", "Your Details"),
    tt(t, "private_tour_flow.steps.confirm", "Confirm & Pay"),
  ];

  const canProceed = [
    destinationSlug !== "",
    startDateId !== null,
    Boolean(name && email && phone),
    true,
  ][step];

  const toggleAddon = (slug: string) => {
    setSelectedAddonSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleReserve = async () => {
    if (!destination || !startDate || !name || !email || !phone) return;
    setIsSubmitting(true);
    try {
      const [first_name, ...rest] = name.trim().split(/\s+/);
      const last_name = rest.join(" ");
      const { data, error } = await supabase
        .from("tour_custom_quote_requests")
        .insert({
          first_name,
          last_name,
          email,
          phone,
          nationality: nationality || null,
          num_guests: persons,
          num_days: days,
          destinations: [destination.label_en],
          destination_slug: destination.slug,
          start_tour_date_id: startDate.id,
          extras_slugs: selectedAddonSlugs,
          services: selectedAddonSlugs,
          budget: budget || null,
          notes: message || null,
          total_amount: totalPrice,
          deposit_amount: deposit,
          currency: destination.currency || "EUR",
          status: "new",
          payload: {
            destination: destination.label_en,
            destination_slug: destination.slug,
            days, persons,
            start_date: startDate.start_date,
            extras: selectedAddonSlugs,
            total: totalPrice, deposit,
            budget, notes: message, nationality,
          },
        })
        .select("id")
        .single();
      if (error) throw error;
      setRequestId(data.id);

      // Send Resend enquiry email (best-effort).
      try {
        await supabase.functions.invoke("send-tour-enquiry", {
          body: {
            fullName: name,
            email,
            whatsapp: phone,
            formType: "private",
            notes: [
              `Destination: ${destination.label_en}`,
              `Duration: ${days} days`,
              `Persons: ${persons}`,
              `Start date: ${formatLongDate(startDate.start_date, "en")}`,
              `Total: ${fmtEur(totalPrice)}`,
              `Deposit (30%): ${fmtEur(deposit)}`,
              selectedAddons.length ? `Add-ons: ${selectedAddons.map((a) => a.label_en).join(", ")}` : "",
              budget ? `Budget: ${budget}` : "",
              nationality ? `Nationality: ${nationality}` : "",
              message ? `Notes: ${message}` : "",
            ].filter(Boolean).join("\n"),
            raw: {
              first_name, last_name,
              destination: destination.label_en,
              days: String(days), guests: String(persons),
              nationality, budget,
              services: selectedAddonSlugs,
              notes_extra: message,
            },
          },
        });
      } catch (e) {
        console.warn("send-tour-enquiry failed (non-blocking):", e);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({
        title: tt(t, "private_tour_flow.toast_submit_failed_title", "Could not submit"),
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayDeposit = async () => {
    if (!requestId || !destination) return;
    setIsRedirecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-private-tour-checkout", {
        body: {
          requestId,
          depositAmount: deposit,
          totalAmount: totalPrice,
          currency: destination.currency || "EUR",
          customerEmail: email,
          customerName: name,
          destinationLabel: destination.label_en,
          days, persons,
          startDateLabel: startDate ? formatLongDate(startDate.start_date, "en") : "",
          origin: window.location.origin,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setIsRedirecting(false);
      toast({
        title: tt(t, "private_tour_flow.toast_payment_failed_title", "Payment unavailable"),
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleBookCall = async () => {
    if (!requestId || !callSlotId) return;
    setIsBookingCall(true);
    try {
      const { error } = await supabase
        .from("tour_custom_quote_requests")
        .update({ clarity_call_slot_id: callSlotId, status: "call_requested" })
        .eq("id", requestId);
      if (error) throw error;
      toast({
        title: tt(t, "private_tour_flow.toast_call_booked_title", "Call requested"),
        description: tt(t, "private_tour_flow.toast_call_booked_desc", "We'll confirm by email shortly."),
      });
      setPaymentChoice(null);
    } catch (err) {
      toast({
        title: tt(t, "private_tour_flow.toast_call_failed_title", "Could not book call"),
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsBookingCall(false);
    }
  };

  if (cfg.loading) {
    return (
      <div className="ptf-loading">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }
  if (cfg.error) {
    return <div className="ptf-error">{cfg.error}</div>;
  }

  // ─── POST-SUBMIT VIEW ──────────────────────────────────────────────────
  if (submitted) {
    const firstName = name.split(" ")[0] || "";
    return (
      <div className="ptf-root">
        <div className="ptf-postsubmit">
          <div className="ptf-postsubmit-head">
            <div className="ptf-check-icon">✓</div>
            <h3 className="ptf-postsubmit-title">
              {tt(t, "private_tour_flow.post.request_received", "Request received,")} {firstName}.
            </h3>
            <p className="ptf-postsubmit-sub">
              {tt(t, "private_tour_flow.post.hold_copy", "Your tour is being held for 48 hours. Complete your deposit below to confirm your spot — or book a clarity call if you have questions first.")}
            </p>
          </div>

          <div className="ptf-recap">
            <div>
              <div className="ptf-eyebrow">{tt(t, "private_tour_flow.post.your_tour", "Your tour")}</div>
              <div className="ptf-recap-title">
                {destination ? pickLocale(destination as any, "label", lang) : ""} — {days} {tt(t, "private_tour_flow.days", "days")}
              </div>
              <div className="ptf-recap-sub">
                {startDate ? formatLongDate(startDate.start_date, lang) : ""} · {persons} {persons === 1 ? tt(t, "private_tour_flow.person", "person") : tt(t, "private_tour_flow.persons", "people")}
              </div>
            </div>
            <div className="ptf-recap-right">
              <div className="ptf-eyebrow">{tt(t, "private_tour_flow.post.deposit_due", "Deposit due")}</div>
              <div className="ptf-recap-deposit">{fmtEur(deposit)}</div>
              <div className="ptf-recap-sub">30% {tt(t, "private_tour_flow.post.of", "of")} {fmtEur(totalPrice)}</div>
            </div>
          </div>

          {!paymentChoice && (
            <div className="ptf-choice-grid">
              <button
                type="button"
                className="ptf-choice ptf-choice-gold"
                onClick={() => setPaymentChoice("pay")}
              >
                <div className="ptf-choice-icon">💳</div>
                <div className="ptf-choice-title">{tt(t, "private_tour_flow.post.pay_now_title", "Pay deposit now")}</div>
                <div className="ptf-choice-desc">
                  {tt(t, "private_tour_flow.post.pay_now_desc_a", "Secure your spot with")} {fmtEur(deposit)}.<br />
                  {tt(t, "private_tour_flow.post.pay_now_desc_b", "Balance due 14 days before the tour.")}
                </div>
              </button>
              <button
                type="button"
                className="ptf-choice"
                onClick={() => setPaymentChoice("call")}
              >
                <div className="ptf-choice-icon">📞</div>
                <div className="ptf-choice-title">{tt(t, "private_tour_flow.post.call_title", "Book a clarity call")}</div>
                <div className="ptf-choice-desc">
                  {tt(t, "private_tour_flow.post.call_desc_a", "15 minutes with Ismael.")}<br />
                  {tt(t, "private_tour_flow.post.call_desc_b", "Free. No commitment.")}
                </div>
              </button>
            </div>
          )}

          {paymentChoice === "pay" && (
            <div className="ptf-pay-panel">
              <div className="ptf-eyebrow">{tt(t, "private_tour_flow.post.secure_payment", "Secure Payment")} — {fmtEur(deposit)}</div>
              <p className="ptf-pay-copy">
                {tt(t, "private_tour_flow.post.pay_intro", "You'll be redirected to Stripe to complete the 30% deposit. After payment, your spot is confirmed and we'll email you with the next steps.")}
              </p>
              <button
                className="ptf-cta ptf-cta-gold"
                onClick={handlePayDeposit}
                disabled={isRedirecting}
              >
                {isRedirecting
                  ? <span className="ptf-cta-spinner"><Loader2 className="animate-spin" size={14} /> {tt(t, "private_tour_flow.post.redirecting", "Redirecting…")}</span>
                  : `${tt(t, "private_tour_flow.post.pay_button", "Pay")} ${fmtEur(deposit)} — ${tt(t, "private_tour_flow.post.confirm_tour", "Confirm Tour")}`}
              </button>
              <p className="ptf-pay-fineprint">
                {tt(t, "private_tour_flow.post.powered_by", "Powered by Stripe · 256-bit SSL · Your card details are never stored")}
              </p>
              <button className="ptf-back-link" onClick={() => setPaymentChoice(null)}>
                ← {tt(t, "private_tour_flow.back", "Back")}
              </button>
            </div>
          )}

          {paymentChoice === "call" && (
            <div className="ptf-call-panel">
              <div className="ptf-eyebrow">{tt(t, "private_tour_flow.post.call_panel_title", "15-Minute Clarity Call with Ismael")}</div>
              <p className="ptf-pay-copy">
                {tt(t, "private_tour_flow.post.call_intro", "Pick a slot. We'll go through your specific situation, any questions you have, and confirm the tour details. No sales pressure.")}
              </p>
              <div className="ptf-call-grid">
                {cfg.callSlots.length === 0 && (
                  <p className="ptf-price-muted">{tt(t, "private_tour_flow.post.no_slots", "No slots available right now — we'll email you with options.")}</p>
                )}
                {cfg.callSlots.map((slot: ClarityCallSlotRow) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`ptf-slot-btn ${callSlotId === slot.id ? "is-active" : ""}`}
                    onClick={() => setCallSlotId(slot.id)}
                  >
                    {formatSlot(slot.slot_at, lang)}
                  </button>
                ))}
              </div>
              {callSlotId && (
                <button className="ptf-cta ptf-cta-gold" onClick={handleBookCall} disabled={isBookingCall}>
                  {isBookingCall
                    ? <Loader2 className="animate-spin" size={14} />
                    : `${tt(t, "private_tour_flow.post.confirm_call", "Confirm Call")}`}
                </button>
              )}
              <button className="ptf-back-link" onClick={() => setPaymentChoice(null)}>
                ← {tt(t, "private_tour_flow.back", "Back")}
              </button>
            </div>
          )}

          <div className="ptf-contact-strip">
            <p>{tt(t, "private_tour_flow.post.questions", "Questions? Reach Ismael directly.")}</p>
            <a href="https://wa.me/351967333803">WhatsApp: +351 967 333 803</a>
            <span className="ptf-dot">·</span>
            <a href="mailto:services@kingsncompany.com">services@kingsncompany.com</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEPS ─────────────────────────────────────────────────────────────
  const renderStepExperience = () => (
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
            <button type="button" className="ptf-counter" onClick={() => setPersons(Math.max(1, persons - 1))}>−</button>
            <span className="ptf-persons-value">{persons}</span>
            <button type="button" className="ptf-counter" onClick={() => setPersons(Math.min(10, persons + 1))}>+</button>
            <span className="ptf-mini-muted">
              {persons === 1 ? tt(t, "private_tour_flow.person", "person") : tt(t, "private_tour_flow.persons", "people")} ({tt(t, "private_tour_flow.max_group", "max 10 per group")})
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

  const renderStepDates = () => (
    <div>
      <h3 className="ptf-h2">{tt(t, "private_tour_flow.dates.title", "Choose your start date")}</h3>
      <p className="ptf-sub">
        {tt(t, "private_tour_flow.dates.subtitle_a", "Select from available tour dates below. Duration:")} <strong className="ptf-strong-gold">{days} {tt(t, "private_tour_flow.days", "days")}</strong>.
      </p>
      <p className="ptf-sub-small">
        {tt(t, "private_tour_flow.dates.subtitle_b", "Dates are managed manually — if none work, book a clarity call and we'll find something that does.")}
      </p>

      <div className="ptf-dates-grid">
        {cfg.tourDates.length === 0 && (
          <p className="ptf-price-muted">{tt(t, "private_tour_flow.dates.empty", "No published dates yet — book a clarity call below and we'll arrange one for you.")}</p>
        )}
        {cfg.tourDates.map((d: AvailableTourDateRow) => {
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
        <a href="https://wa.me/351967333803" target="_blank" rel="noreferrer" className="ptf-callout-btn">
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

  const renderStepDetails = () => {
    const f = {
      name: tt(t, "private_tour_flow.details.name", "Full name *"),
      name_ph: tt(t, "private_tour_flow.details.name_ph", "As on your passport"),
      email: tt(t, "private_tour_flow.details.email", "Email address *"),
      email_ph: tt(t, "private_tour_flow.details.email_ph", "Your best email"),
      phone: tt(t, "private_tour_flow.details.phone", "WhatsApp / phone *"),
      phone_ph: tt(t, "private_tour_flow.details.phone_ph", "+44 or +1 with country code"),
      nat: tt(t, "private_tour_flow.details.nationality", "Nationality"),
      nat_ph: tt(t, "private_tour_flow.details.nat_ph", "e.g. British, American, French"),
      budget: tt(t, "private_tour_flow.details.budget", "Approximate budget for property purchase"),
      budget_ph: tt(t, "private_tour_flow.details.budget_ph", "e.g. 300.000–500.000€"),
      msg: tt(t, "private_tour_flow.details.message", "Anything specific you want us to know?"),
      msg_ph: tt(t, "private_tour_flow.details.message_ph", "Investment goals, property type preferences, family situation, questions you already have..."),
    };
    return (
      <div>
        <h3 className="ptf-h2">{tt(t, "private_tour_flow.details.title", "Your details")}</h3>
        <p className="ptf-sub">{tt(t, "private_tour_flow.details.subtitle", "A few things to help us prepare for you specifically.")}</p>
        <div className="ptf-form-grid">
          <FieldInput label={f.name} value={name} onChange={setName} placeholder={f.name_ph} />
          <FieldInput label={f.email} value={email} onChange={setEmail} placeholder={f.email_ph} type="email" />
          <FieldInput label={f.phone} value={phone} onChange={setPhone} placeholder={f.phone_ph} />
          <FieldInput label={f.nat} value={nationality} onChange={setNationality} placeholder={f.nat_ph} />
          <div className="ptf-form-full">
            <FieldInput label={f.budget} value={budget} onChange={setBudget} placeholder={f.budget_ph} />
          </div>
          <div className="ptf-form-full">
            <Label>{f.msg}</Label>
            <textarea
              className="ptf-textarea"
              value={message}
              maxLength={2000}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={f.msg_ph}
              rows={4}
            />
          </div>
        </div>
        <div className="ptf-mt-24">
          <PriceSummary destination={destination} days={days} persons={persons} selectedAddons={selectedAddons} t={t} />
        </div>
      </div>
    );
  };

  const renderStepConfirm = () => (
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

  return (
    <div className="ptf-root">
      <Steps current={step} labels={stepLabels} />

      <div>
        {step === 0 && renderStepExperience()}
        {step === 1 && renderStepDates()}
        {step === 2 && renderStepDetails()}
        {step === 3 && renderStepConfirm()}
      </div>

      <div className="ptf-nav">
        {step > 0 ? (
          <button type="button" className="ptf-back" onClick={() => setStep(step - 1)}>
            ← {tt(t, "private_tour_flow.back", "Back")}
          </button>
        ) : <div />}
        {step < 3 ? (
          <button
            type="button"
            className="ptf-cta ptf-cta-gold"
            onClick={() => canProceed && setStep(step + 1)}
            disabled={!canProceed}
          >
            {step === 0 ? `${tt(t, "private_tour_flow.next.dates", "Select dates")} →`
              : step === 1 ? `${tt(t, "private_tour_flow.next.details", "Your details")} →`
              : `${tt(t, "private_tour_flow.next.review", "Review booking")} →`}
          </button>
        ) : (
          <button
            type="button"
            className="ptf-cta ptf-cta-gold"
            onClick={handleReserve}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <Loader2 className="animate-spin" size={14} />
              : `${tt(t, "private_tour_flow.reserve", "Reserve my spot")} →`}
          </button>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        className="ptf-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ptf-summary-row">
      <span className="ptf-summary-label">{label}</span>
      <span className="ptf-summary-value">{value}</span>
    </div>
  );
}