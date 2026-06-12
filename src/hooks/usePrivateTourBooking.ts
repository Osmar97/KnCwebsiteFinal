import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PRIVATE_TOUR_DEPOSIT_RATIO } from "@/lib/tourConfig";
import type { AddonRow, DestinationRow, AvailableTourDateRow } from "@/hooks/usePrivateTourConfig";

export { PRIVATE_TOUR_DEPOSIT_RATIO };

/** 30% of the total, rounded to the nearest euro. */
export const computeDeposit = (total: number): number =>
  Math.round(total * PRIVATE_TOUR_DEPOSIT_RATIO);

interface ReserveArgs {
  destination: DestinationRow;
  startDate: AvailableTourDateRow;
  selectedAddons: AddonRow[];
  selectedAddonSlugs: string[];
  days: number;
  persons: number;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  budget: string;
  message: string;
  totalPrice: number;
  deposit: number;
  formatLongDate: (iso: string) => string;
  fmtEur: (n: number) => string;
}

interface CheckoutArgs {
  requestId: string;
  destination: DestinationRow;
  startDate: AvailableTourDateRow | null;
  days: number;
  persons: number;
  totalPrice: number;
  deposit: number;
  name: string;
  email: string;
  formatLongDate: (iso: string) => string;
}

/**
 * Encapsulates the three async actions used by `PrivateTourBookingFlow`:
 *   reserve()      → insert quote request + best-effort enquiry email
 *   payDeposit()   → Stripe Checkout redirect
 *   bookCall()     → attach a clarity-call slot to an existing request
 *
 * Toast titles/descriptions are passed via `messages` so the component keeps
 * full control over i18n strings.
 */
export interface BookingMessages {
  submitFailedTitle: string;
  paymentFailedTitle: string;
  callBookedTitle: string;
  callBookedDesc: string;
  callFailedTitle: string;
}

export function usePrivateTourBooking(messages: BookingMessages) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isBookingCall, setIsBookingCall] = useState(false);

  const reserve = async (args: ReserveArgs): Promise<string | null> => {
    const {
      destination, startDate, selectedAddons, selectedAddonSlugs,
      days, persons, name, email, phone, nationality, budget, message,
      totalPrice, deposit, formatLongDate, fmtEur,
    } = args;

    setIsSubmitting(true);
    try {
      const [first_name, ...rest] = name.trim().split(/\s+/);
      const last_name = rest.join(" ") || "—";

      const { data: newRequestId, error } = await supabase.rpc(
        "create_custom_quote_request",
        {
          _first_name: first_name,
          _last_name: last_name,
          _email: email,
          _phone: phone,
          _nationality: nationality || null,
          _num_guests: persons,
          _num_days: days,
          _destinations: [destination.label_en],
          _destination_slug: destination.slug,
          _start_tour_date_id: startDate.id,
          _extras_slugs: selectedAddonSlugs,
          _budget: budget || null,
          _notes: message || null,
          _total_amount: totalPrice,
          _deposit_amount: deposit,
          _currency: destination.currency || "EUR",
          _payload: {
            destination: destination.label_en,
            destination_slug: destination.slug,
            days, persons,
            start_date: startDate.start_date,
            extras: selectedAddonSlugs,
            total: totalPrice, deposit,
            budget, notes: message, nationality,
          },
        },
      );
      if (error) throw error;
      if (!newRequestId) throw new Error("Failed to create quote request");

      // Best-effort enquiry email — failure must not block the user.
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
              `Start date: ${formatLongDate(startDate.start_date)}`,
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
              extras: selectedAddonSlugs,
              notes_extra: message,
            },
          },
        });
      } catch (e) {
        console.warn("send-tour-enquiry failed (non-blocking):", e);
      }

      return newRequestId;
    } catch (err) {
      console.error(err);
      toast({
        title: messages.submitFailedTitle,
        description: (err as Error).message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const payDeposit = async (args: CheckoutArgs): Promise<void> => {
    const { requestId, destination, startDate, days, persons, totalPrice, deposit, name, email, formatLongDate } = args;
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
          startDateLabel: startDate ? formatLongDate(startDate.start_date) : "",
          origin: window.location.origin,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setIsRedirecting(false);
      toast({
        title: messages.paymentFailedTitle,
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const bookCall = async (requestId: string, callSlotId: string): Promise<boolean> => {
    setIsBookingCall(true);
    try {
      const { error } = await supabase
        .from("tour_custom_quote_requests")
        .update({ clarity_call_slot_id: callSlotId, status: "call_requested" })
        .eq("id", requestId);
      if (error) throw error;
      toast({
        title: messages.callBookedTitle,
        description: messages.callBookedDesc,
      });
      return true;
    } catch (err) {
      toast({
        title: messages.callFailedTitle,
        description: (err as Error).message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsBookingCall(false);
    }
  };

  return { isSubmitting, isRedirecting, isBookingCall, reserve, payDeposit, bookCall };
}