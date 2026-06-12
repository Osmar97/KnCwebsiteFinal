/**
 * Tour pricing — single edge-function source of truth.
 *
 * Mirror of `src/lib/tourConfig.ts` (frontend). Keep both in sync until
 * pricing is read from the `tours` DB table.
 */
export const TOUR_RESERVE_PRICE_EUR = 3500;
export const TOUR_RESERVE_PRICE_CENTS = TOUR_RESERVE_PRICE_EUR * 100;

/** Clarity-call slot duration (Google Calendar event length). */
export const CALENDAR_SLOT_DURATION_MIN = 20;
export const CALENDAR_SLOT_DURATION_MS = CALENDAR_SLOT_DURATION_MIN * 60 * 1000;