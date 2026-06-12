/**
 * Tour pricing — single frontend source of truth.
 *
 * The Stripe edge function (`supabase/functions/create-stripe-checkout`)
 * also reads from `supabase/functions/_shared/tour-config.ts`. Both files
 * must be kept in sync until pricing is migrated to the `tours` DB table.
 */
export const TOUR_RESERVE_PRICE_EUR = 3500;

/** Deposit ratio for private/custom tour bookings (30%). */
export const PRIVATE_TOUR_DEPOSIT_RATIO = 0.3;

/** Locale-aware price for hero/CTA strings (no currency symbol). */
export const formatTourReservePrice = (
  locale: "en" | "pt" | "fr" = "en",
): string => {
  // EN uses comma thousands separator (3,500), PT/FR use dot (3.500)
  return locale === "en"
    ? TOUR_RESERVE_PRICE_EUR.toLocaleString("en-US")
    : TOUR_RESERVE_PRICE_EUR.toLocaleString("de-DE");
};

/** Replace the `{price}` placeholder in a translated string. */
export const interpolateTourPrice = (
  template: string,
  locale: "en" | "pt" | "fr" = "en",
): string => template.split("{price}").join(`${formatTourReservePrice(locale)}€`);