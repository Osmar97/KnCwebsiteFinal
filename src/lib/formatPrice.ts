/**
 * Centralized price formatter for the Tours feature.
 *
 * Display rule: amount first, currency symbol after (e.g. "790€", "1,200€").
 * For non-EUR currencies the ISO code is appended (e.g. "850 USD") to keep
 * the rule consistent without ambiguity.
 *
 * This helper is for DISPLAY only — never use it for Stripe calculations,
 * checkout totals, or any stored value. Always operate on the raw numeric
 * `amount` for arithmetic.
 */

const SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

export interface FormatPriceOptions {
  /** When true, formats with no thousand separators (compact). */
  compact?: boolean;
  /** Force a specific locale for digit grouping. */
  locale?: string;
}

export function formatPrice(
  amount: number | string | null | undefined,
  currency: string = "EUR",
  options: FormatPriceOptions = {},
): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (num === null || num === undefined || Number.isNaN(num)) return "";

  const locale = options.locale ?? "en-GB";
  const formatted = options.compact
    ? String(num)
    : new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(num);

  const code = (currency || "EUR").toUpperCase();
  const symbol = SYMBOLS[code];

  // Suffix style: "790€" for known symbols, "790 USD" otherwise.
  return symbol ? `${formatted}${symbol}` : `${formatted} ${code}`;
}

/**
 * Short numeric format with K/M suffix, still using the trailing currency
 * symbol (e.g. 260000 EUR -> "260K€"). Useful for stats / hero numbers.
 */
/**
 * Format a number using European style (periods for thousands, no decimals).
 * Use this when you need just the formatted number without a currency symbol,
 * e.g. property pages that append "€" separately: `{formatNumber(price)}€`.
 */
export function formatNumber(
  amount: number | string | null | undefined,
  options: { locale?: string } = {},
): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (num === null || num === undefined || Number.isNaN(num)) return "";
  return new Intl.NumberFormat(options.locale ?? "pt-PT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/** Company contact phone number */
export const CONTACT_PHONE = "+351 967 333 803";
export const CONTACT_PHONE_LINK = "tel:+351967333803";

export function formatPriceShort(
  amount: number | null | undefined,
  currency: string = "EUR",
): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "";
  const abs = Math.abs(amount);
  let value: string;
  if (abs >= 1_000_000) value = `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  else if (abs >= 1_000) value = `${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}K`;
  else value = String(amount);
  const code = (currency || "EUR").toUpperCase();
  const symbol = SYMBOLS[code];
  return symbol ? `${value}${symbol}` : `${value} ${code}`;
}