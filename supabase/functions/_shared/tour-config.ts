/**
 * Tour pricing — single edge-function source of truth.
 *
 * Mirror of `src/lib/tourConfig.ts` (frontend). Keep both in sync until
 * pricing is read from the `tours` DB table.
 */
export const TOUR_RESERVE_PRICE_EUR = 3500;
export const TOUR_RESERVE_PRICE_CENTS = TOUR_RESERVE_PRICE_EUR * 100;