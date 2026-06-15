import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Language } from "@/pages/TourTranslations";
import { usePrivateTourConfig } from "@/hooks/usePrivateTourConfig";
import { usePrivateTourBooking } from "@/hooks/usePrivateTourBooking";
import { Steps } from "./booking-flow/Steps";
import { StepExperience } from "./booking-flow/StepExperience";
import { StepDates } from "./booking-flow/StepDates";
import { StepDetails } from "./booking-flow/StepDetails";
import { StepConfirm } from "./booking-flow/StepConfirm";
import { PostSubmitView } from "./booking-flow/PostSubmitView";
import { fmtEur, formatLongDate, tt, type T } from "./booking-flow/format";

interface Props {
  t: T;
  lang: Language;
}

export default function PrivateTourBookingFlow({ t, lang }: Props) {
  const cfg = usePrivateTourConfig();

  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isFirstStepRender = useRef(true);
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - 96;
    window.scrollTo({ top, behavior: "smooth" });
  }, [step]);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<"pay" | "call" | null>(null);

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

  const promoPct = cfg.settings?.promo_discount_pct ?? 0;
  const totalPrice = useMemo(() => {
    if (!destination) return 0;
    const base = Number(destination.base_price_per_day_per_person) * days * persons;
    const extras = selectedAddons.reduce((s, a) => s + Number(a.price) * persons, 0);
    const subtotal = base + extras;
    return promoPct ? Math.round(subtotal * (1 - promoPct / 100)) : subtotal;
  }, [destination, days, persons, selectedAddons, promoPct]);
  const depositRatio = cfg.settings?.deposit_ratio ?? 0.3;
  const deposit = Math.round(totalPrice * depositRatio);

  const { isSubmitting, isRedirecting, isBookingCall, reserve, payDeposit, bookCall } =
    usePrivateTourBooking({
      submitFailedTitle: tt(t, "private_tour_flow.toast_submit_failed_title", "Could not submit"),
      paymentFailedTitle: tt(t, "private_tour_flow.toast_payment_failed_title", "Payment unavailable"),
      callBookedTitle: tt(t, "private_tour_flow.toast_call_booked_title", "Call requested"),
      callBookedDesc: tt(t, "private_tour_flow.toast_call_booked_desc", "We'll confirm by email shortly."),
      callFailedTitle: tt(t, "private_tour_flow.toast_call_failed_title", "Could not book call"),
    });

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
    const newRequestId = await reserve({
      destination, startDate, selectedAddons, selectedAddonSlugs,
      days, persons, name, email, phone, nationality, budget, message,
      totalPrice, deposit,
      formatLongDate: (iso) => formatLongDate(iso, "en"),
      fmtEur,
    });
    if (newRequestId) {
      setRequestId(newRequestId);
      setSubmitted(true);
    }
  };

  const handlePayDeposit = async () => {
    if (!requestId || !destination) return;
    await payDeposit({
      requestId, destination, startDate,
      days, persons, totalPrice, deposit, name, email,
      formatLongDate: (iso) => formatLongDate(iso, "en"),
    });
  };

  const handleBookCall = async () => {
    if (!requestId || !callSlotId) return;
    const ok = await bookCall(requestId, callSlotId);
    if (ok) setPaymentChoice(null);
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

  if (submitted) {
    return (
      <PostSubmitView
        t={t} lang={lang} name={name}
        destination={destination} days={days} persons={persons} startDate={startDate}
        totalPrice={totalPrice} deposit={deposit}
        paymentChoice={paymentChoice} setPaymentChoice={setPaymentChoice}
        isRedirecting={isRedirecting} isBookingCall={isBookingCall}
        handlePayDeposit={handlePayDeposit} handleBookCall={handleBookCall}
        callSlots={cfg.callSlots} callSlotId={callSlotId} setCallSlotId={setCallSlotId}
      />
    );
  }

  return (
    <div className="ptf-root" ref={rootRef}>
      <Steps current={step} labels={stepLabels} />

      <div>
        {step === 0 && (
          <StepExperience
            t={t} lang={lang} cfg={cfg}
            destination={destination}
            destinationSlug={destinationSlug} setDestinationSlug={setDestinationSlug}
            days={days} setDays={setDays}
            persons={persons} setPersons={setPersons}
            selectedAddonSlugs={selectedAddonSlugs} toggleAddon={toggleAddon}
            selectedAddons={selectedAddons}
          />
        )}
        {step === 1 && (
          <StepDates
            t={t} lang={lang}
            tourDates={cfg.tourDates}
            days={days} persons={persons}
            startDateId={startDateId} setStartDateId={setStartDateId}
            startDate={startDate}
            destination={destination} selectedAddons={selectedAddons}
          />
        )}
        {step === 2 && (
          <StepDetails
            t={t}
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone}
            nationality={nationality} setNationality={setNationality}
            budget={budget} setBudget={setBudget}
            message={message} setMessage={setMessage}
            destination={destination} days={days} persons={persons}
            selectedAddons={selectedAddons}
          />
        )}
        {step === 3 && (
          <StepConfirm
            t={t} lang={lang}
            destination={destination} days={days} persons={persons}
            startDate={startDate} name={name} email={email} phone={phone}
            selectedAddons={selectedAddons}
          />
        )}
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