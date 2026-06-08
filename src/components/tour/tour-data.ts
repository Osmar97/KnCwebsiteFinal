import type { TourRow } from "@/hooks/useTours";

export function tourCategoryFilter(t: TourRow): "portugal" | "cabo-verde" | "combined" {
  const flag = t.flag || "";
  if (flag === "🇵🇹") return "portugal";
  if (flag === "🇨🇻") return "cabo-verde";
  return "combined";
}

export function countryFromFlag(flag: string | null): string {
  if (flag === "🇵🇹") return "Portugal";
  if (flag === "🇨🇻") return "Cabo Verde";
  return "Portugal · Cabo Verde";
}

/** Maps a tour's hero_image (e.g. "ti-lisbon") to its destination bg class. */
export function destBgClassFor(heroImage: string | null, flag: string | null): string {
  if (heroImage?.startsWith("ti-")) {
    return `db-${heroImage.slice(3)}`;
  }
  if (flag === "🇨🇻") return "db-cv";
  return "db-lisbon";
}

export const HOW_STEPS = [
  {
    num: "01",
    title: "Apply for Your Tour",
    body: "Submit your budget, target market, and buying timeline. We confirm your tour date and match you with the right property shortlist within 48 hours.",
  },
  {
    num: "02",
    title: "Pre-Tour Briefing",
    body: "One week before departure, we hold a 60-minute video call covering your shortlist, tax implications, visa options, and what to bring to property viewings.",
  },
  {
    num: "03",
    title: "The Tour — On the Ground",
    body: "Curated property viewings, neighbourhood walks, legal and financial briefings, and one cultural experience that helps you understand where you're investing.",
  },
  {
    num: "04",
    title: "Solicitor Day",
    body: "A dedicated session with a bilingual solicitor and, if needed, a mortgage broker. Walk through the legal structure and ask every question you have.",
  },
  {
    num: "05",
    title: "Post-Tour Report & Follow-Up",
    body: "Within 5 days of your tour, you receive a written report: property shortlist, solicitor notes, tax overview, and your recommended next steps.",
  },
];

export const TESTIMONIALS = [
  {
    initials: "MJ", avClass: "av1",
    text: "I came on the Lisbon tour in March not sure if I was ready. By day 3 I had a solicitor and a property I loved. I signed the CPCV six weeks later. Kings 'n Company made it real.",
    name: "Marcus J.",
    origin: "Atlanta, GA · Lisbon Property Owner",
  },
  {
    initials: "AF", avClass: "av2",
    text: "The dual-market tour changed how I see my money. I bought in Praia and I'm now under offer in Porto. Ismael and the team know every corner of both markets and it shows.",
    name: "Amina F.",
    origin: "London, UK · Porto & Praia Investor",
  },
  {
    initials: "DS", avClass: "av3",
    text: "As a first-time buyer abroad the legal side terrified me. Having the solicitor day built into the tour and getting that written report after made me feel protected the whole way through.",
    name: "David S.",
    origin: "Toronto, CA · Algarve Property Owner",
  },
];

export const INCLUDES = [
  { icon: "🛎", title: "Hotel Included", desc: "3-star accommodation, upgraded tiers available. Negotiated group rates ensure quality without overpaying." },
  { icon: "🚐", title: "Private Transport", desc: "Dedicated driver between all property visits, neighbourhoods, and activities. No taxis, no confusion." },
  { icon: "☀️", title: "Breakfast + Lunch", desc: "Breakfast at the hotel, lunch at a curated local restaurant chosen for the day's area and energy." },
  { icon: "📋", title: "Consultation & Debrief", desc: "A call before you arrive, and a structured final session before you leave. You come with questions. You leave with a plan." },
  { icon: "🏛", title: "Airport Transfers", desc: "Pickup and drop-off included for private tours. Group tours include an optional shared shuttle." },
  { icon: "🎭", title: "One Curated Activity", desc: "A boat tour, cultural workshop, or community event matched to your group's vibe. Context matters." },
];

export const EMAIL_CONTACT = "mailto:services@kingsncompany.com";