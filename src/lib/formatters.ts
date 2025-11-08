/**
 * Format price using European format (periods for thousands, commas for decimals)
 * Example: 60000 → "60.000" or 60000.50 → "60.000,50"
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-PT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Company contact phone number
 */
export const CONTACT_PHONE = "+351 939 953 609";
export const CONTACT_PHONE_LINK = "tel:+351939953609";
