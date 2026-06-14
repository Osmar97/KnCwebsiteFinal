import { Loader2 } from "lucide-react";
import type { Language } from "@/pages/TourTranslations";
import { pickLocale, type AvailableTourDateRow, type ClarityCallSlotRow, type DestinationRow } from "@/hooks/usePrivateTourConfig";
import { fmtEur, formatLongDate, formatSlot, tt, type T } from "./format";

interface Props {
  t: T;
  lang: Language;
  name: string;
  destination: DestinationRow | undefined;
  days: number;
  persons: number;
  startDate: AvailableTourDateRow | null;
  totalPrice: number;
  deposit: number;
  paymentChoice: "pay" | "call" | null;
  setPaymentChoice: (v: "pay" | "call" | null) => void;
  isRedirecting: boolean;
  isBookingCall: boolean;
  handlePayDeposit: () => void | Promise<void>;
  handleBookCall: () => void | Promise<void>;
  callSlots: ClarityCallSlotRow[];
  callSlotId: string | null;
  setCallSlotId: (id: string) => void;
}

export function PostSubmitView({
  t, lang, name, destination, days, persons, startDate, totalPrice, deposit,
  paymentChoice, setPaymentChoice, isRedirecting, isBookingCall,
  handlePayDeposit, handleBookCall, callSlots, callSlotId, setCallSlotId,
}: Props) {
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
            <button type="button" className="ptf-choice ptf-choice-gold" onClick={() => setPaymentChoice("pay")}>
              <div className="ptf-choice-icon">💳</div>
              <div className="ptf-choice-title">{tt(t, "private_tour_flow.post.pay_now_title", "Pay deposit now")}</div>
              <div className="ptf-choice-desc">
                {tt(t, "private_tour_flow.post.pay_now_desc_a", "Secure your spot with")} {fmtEur(deposit)}.<br />
                {tt(t, "private_tour_flow.post.pay_now_desc_b", "Balance due 14 days before the tour.")}
              </div>
            </button>
            <button type="button" className="ptf-choice" onClick={() => setPaymentChoice("call")}>
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
            <button className="ptf-cta ptf-cta-gold" onClick={handlePayDeposit} disabled={isRedirecting}>
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
              {callSlots.length === 0 && (
                <p className="ptf-price-muted">{tt(t, "private_tour_flow.post.no_slots", "No slots available right now — we'll email you with options.")}</p>
              )}
              {callSlots.map((slot) => (
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