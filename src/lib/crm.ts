export type CrmSource = "waitlist" | "quote" | "contact";

export const CRM_STATUSES = [
  "new",
  "contacted",
  "discovery_scheduled",
  "discovery_completed",
  "qualified",
  "proposal_sent",
  "tour_booked",
  "closed_won",
  "closed_lost",
] as const;
export type CrmStatus = (typeof CRM_STATUSES)[number];

export const STATUS_LABELS: Record<CrmStatus, string> = {
  new: "New Lead",
  contacted: "Contacted",
  discovery_scheduled: "Discovery Scheduled",
  discovery_completed: "Discovery Completed",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  tour_booked: "Tour Booked",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export const SOURCE_LABELS: Record<CrmSource, string> = {
  waitlist: "Waitlist",
  quote: "Custom Quote",
  contact: "Contact Form",
};

export const JOURNEY_STAGES = [
  "lead",
  "discovery_call",
  "tour_booked",
  "tour_attended",
  "properties_reviewed",
  "property_shortlisted",
  "offer_submitted",
  "property_purchased",
] as const;
export type JourneyStage = (typeof JOURNEY_STAGES)[number];

export const JOURNEY_LABELS: Record<JourneyStage, string> = {
  lead: "Lead",
  discovery_call: "Discovery Call",
  tour_booked: "Tour Booked",
  tour_attended: "Tour Attended",
  properties_reviewed: "Properties Reviewed",
  property_shortlisted: "Property Shortlisted",
  offer_submitted: "Offer Submitted",
  property_purchased: "Property Purchased",
};

export const statusColor = (s: string) => {
  if (["new"].includes(s)) return "bg-blue-500/10 text-blue-300 border-blue-500/30";
  if (["contacted", "discovery_scheduled"].includes(s)) return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  if (["discovery_completed", "qualified", "proposal_sent"].includes(s)) return "bg-purple-500/10 text-purple-300 border-purple-500/30";
  if (["tour_booked", "closed_won"].includes(s)) return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  if (["closed_lost"].includes(s)) return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  return "bg-gray-500/10 text-gray-300 border-gray-500/30";
};

export const leadKey = (source: CrmSource, id: string) => `${source}:${id}`;