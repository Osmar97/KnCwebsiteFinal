import { useState, FormEvent } from "react";
import { Loader2 } from "lucide-react";

export type InlineFormVariant = "private" | "waitlist";

interface Field {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface CheckOption { label: string; value?: string; price?: number; }
interface VibeOption { icon: string; name: string; desc: string; }
interface SelectOption { value: string; label: string; }

const VIBES: VibeOption[] = [
  { icon: "📊", name: "Investment", desc: "ROI, yield, growth" },
  { icon: "🌿", name: "Lifestyle", desc: "Quality of life" },
  { icon: "🌊", name: "Beach", desc: "Coastal, sea views" },
  { icon: "🏙", name: "City", desc: "Urban, walkable" },
  { icon: "🌲", name: "Nature", desc: "Rural, mountains" },
  { icon: "✨", name: "Luxury", desc: "Premium properties" },
];

const PRIVATE_DAYS: SelectOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1), label: `${i + 1} ${i === 0 ? "day" : "days"}`,
}));
const PRIVATE_GUESTS: SelectOption[] = [
  { value: "1", label: "1 person (solo)" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
];
const PRIVATE_DESTS: SelectOption[] = [
  { value: "lisbon", label: "Lisbon District only" },
  { value: "lisbon_setubal", label: "Lisbon + Setúbal" },
  { value: "lisbon_algarve", label: "Lisbon + Algarve" },
  { value: "lisbon_porto", label: "Lisbon + Porto" },
  { value: "porto", label: "Porto area only" },
  { value: "algarve", label: "Algarve only" },
  { value: "cabo_verde_single", label: "Cabo Verde – single island" },
  { value: "cabo_verde_multi", label: "Cabo Verde – multi-island (2+)" },
  { value: "portugal_cabo_verde", label: "Portugal + Cabo Verde" },
  { value: "custom", label: "Other / Custom region" },
];
const HOTEL_OPTS: SelectOption[] = [
  { value: "3", label: "3-star (included)" },
  { value: "4", label: "4-star (+€60/night)" },
  { value: "5", label: "5-star / Boutique (+€140/night)" },
];
const BUDGETS: SelectOption[] = [
  { value: "Under €100,000", label: "Under €100,000" },
  { value: "€100,000 – €200,000", label: "€100,000 – €200,000" },
  { value: "€200,000 – €350,000", label: "€200,000 – €350,000" },
  { value: "€350,000 – €500,000", label: "€350,000 – €500,000" },
  { value: "€500,000 – €1,000,000", label: "€500,000 – €1,000,000" },
  { value: "Over €1,000,000", label: "Over €1,000,000" },
];

const PROP_TYPES: CheckOption[] = [
  { label: "Apartments (urban)" }, { label: "Houses / Villas" },
  { label: "New development / off-plan" }, { label: "Renovation projects" },
  { label: "Quintas / Rural" }, { label: "Commercial / Mixed-use" },
  { label: "Land / Plots" }, { label: "Surprise me" },
];

const SERVICES: CheckOption[] = [
  { label: "Lawyer meeting (NIF, legal)", price: 200 },
  { label: "Mortgage broker session", price: 150 },
  { label: "Accountant / Tax advisor", price: 150 },
  { label: "Contractor walkthrough", price: 180 },
  { label: "Power of attorney setup", price: 250 },
  { label: "NIF application assistance", price: 120 },
  { label: "Visa process consultation", price: 200 },
  { label: "Post-trip written report", price: 120 },
];

const WAITLIST_SERVICES: CheckOption[] = [
  { label: "Lawyer / Legal consultation" }, { label: "Mortgage broker" },
  { label: "Tax / Accountant session" }, { label: "NIF + visa guidance" },
];

const WAITLIST_DESTS: SelectOption[] = [
  { value: "Portugal", label: "Portugal" }, { value: "Cabo Verde", label: "Cabo Verde" },
  { value: "Both", label: "Both" }, { value: "Undecided", label: "Undecided" },
];
const WAITLIST_TYPES: SelectOption[] = [
  { value: "group", label: "Group tour (join waitlist)" },
  { value: "private", label: "Private tour (custom experience)" },
  { value: "both", label: "Both — help me decide" },
];
const GROUP_THEMES: CheckOption[] = [
  { label: "Sun & Yield (Algarve)" }, { label: "Lisbon Ascent" },
  { label: "Entry Point (Porto)" }, { label: "Cabo Verde Opener" },
  { label: "Dual Market" }, { label: "Investor Family" },
  { label: "First-Time Buyer" }, { label: "Heritage Collector" },
];

interface Props {
  variant: InlineFormVariant;
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
  isSubmitting: boolean;
  submitted: boolean;
}

export default function InlineTourForm({ variant, onSubmit, isSubmitting, submitted }: Props) {
  const [vibes, setVibes] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const isPrivate = variant === "private";

  const toggleVibe = (name: string) => {
    setVibes((curr) => {
      if (curr.includes(name)) return curr.filter((v) => v !== name);
      if (isPrivate && curr.length >= 2) return curr;
      return [...curr, name];
    });
  };
  const toggleCheck = (group: string, label: string) => {
    setChecks((curr) => {
      const list = curr[group] || [];
      const next = list.includes(label) ? list.filter((l) => l !== label) : [...list, label];
      return { ...curr, [group]: next };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = Object.fromEntries(fd.entries());
    data.vibes = vibes;
    Object.entries(checks).forEach(([k, v]) => { data[k] = v; });
    // Build a combined fullName and notes summary for the email backend
    const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    const summaryLines: string[] = [];
    Object.entries(data).forEach(([k, v]) => {
      if (!v || (Array.isArray(v) && v.length === 0)) return;
      summaryLines.push(`${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
    });
    await onSubmit({
      fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      notes: summaryLines.join("\n"),
      formType: variant,
      raw: data,
    });
  };

  if (submitted) {
    return (
      <div className="success-msg shown">
        <div className="success-icon">{isPrivate ? "✉️" : "🎯"}</div>
        <h4>{isPrivate ? "Your inquiry is on its way." : "You're on the list."}</h4>
        <p>
          {isPrivate
            ? "We'll review your details and send a tailored quote within 48 hours. Keep an eye on your email and WhatsApp."
            : "We'll be in touch within 5 business days to schedule your individual pre-trip call and confirm the right experience for you."}
        </p>
        <p className="success-sign">— Ismael Gomes Queta, Kings 'n Company</p>
      </div>
    );
  }

  return (
    <form className="form-wrap" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{isPrivate ? "Private Tour Inquiry" : "Waitlist & Inquiry Form"}</h3>
        <p>
          {isPrivate
            ? <>All fields marked <span className="req">*</span> are required. The more detail you share, the more precise your quote.</>
            : "Complete this form to join a group waitlist, request a private tour, or both. We'll match you based on your preferences and available spots."}
        </p>
      </div>

      <Divider label={isPrivate ? "About You" : "Contact Info"} />
      <div className="form-row">
        <FormInput name="first_name" label="First Name" required placeholder="First name" />
        <FormInput name="last_name" label="Last Name" required placeholder="Last name" />
      </div>
      <div className="form-row">
        <FormInput name="email" type="email" label="Email" required placeholder="email@example.com" />
        <FormInput name="whatsapp" type="tel" label="WhatsApp Number" required placeholder="+1 555 000 0000" />
      </div>
      <div className="form-row">
        <FormInput name="country" label="Country of Residence" required placeholder="e.g. United States" />
        <FormInput name="nationality" label="Nationality" placeholder="e.g. American, Guinean..." />
      </div>

      {isPrivate ? (
        <>
          <Divider label="Trip Details" />
          <div className="form-row">
            <FormSelect name="days" label="Number of Days" required options={PRIVATE_DAYS} placeholder="Select duration" />
            <FormSelect name="guests" label="Number of Guests" required options={PRIVATE_GUESTS} placeholder="Select guests" />
          </div>
          <div className="form-row">
            <FormInput name="date1" label="Preferred Start Date" placeholder="e.g. September 2026, flexible" />
            <FormInput name="date2" label="Alternative Date" placeholder="Second option if available" />
          </div>
          <FormSelect name="destination" label="Primary Destination" required options={PRIVATE_DESTS} placeholder="Select destination" />

          <VibeGroup label="Your Vibe (select up to 2)" required vibes={VIBES} selected={vibes} onToggle={toggleVibe} />

          <CheckGroup label="Types of Properties to Visit" options={PROP_TYPES}
            selected={checks.propertyTypes || []} onToggle={(l) => toggleCheck("propertyTypes", l)} />

          <CheckGroup label="Additional Services" options={SERVICES}
            selected={checks.services || []} onToggle={(l) => toggleCheck("services", l)} />

          <FormSelect name="hotel" label="Hotel Preference" options={HOTEL_OPTS} />
          <FormSelect name="budget" label="Property Budget (purchase)" options={BUDGETS} placeholder="Prefer not to say" />
          <FormTextarea name="notes_extra" label="Anything Else We Should Know"
            placeholder="Your timeline, specific neighborhoods, questions, dietary needs..." />
        </>
      ) : (
        <>
          <Divider label="Your Goals" />
          <div className="form-row">
            <FormSelect name="destination" label="Preferred Destination" required options={WAITLIST_DESTS} placeholder="Select destination" />
            <FormInput name="travel_window" label="Preferred Travel Window" placeholder="e.g. Q3 2026, flexible..." />
          </div>
          <VibeGroup label="Your Vibe (select all that apply)" vibes={VIBES} selected={vibes} onToggle={toggleVibe} />
          <CheckGroup label="If group tours interest you, which themes?" options={GROUP_THEMES}
            selected={checks.themes || []} onToggle={(l) => toggleCheck("themes", l)} />
          <CheckGroup label="Additional services of interest" options={WAITLIST_SERVICES}
            selected={checks.services || []} onToggle={(l) => toggleCheck("services", l)} />
          <div className="form-row">
            <FormSelect name="budget" label="Property Budget (purchase)" options={BUDGETS} placeholder="Prefer not to say" />
            <FormSelect name="preference" label="Your Preference" options={WAITLIST_TYPES} placeholder="Select format" />
          </div>
          <FormTextarea name="notes_extra" label="Tell us more"
            placeholder="Your situation, goals, timeline, specific questions..." />
        </>
      )}

      <div className="form-submit">
        <button type="submit" className="btn-form-submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isPrivate ? "Request My Custom Quote" : "Join the Waitlist"}
        </button>
        <p className="form-foot-note">
          {isPrivate
            ? "We'll respond within 48 hours with your tailored quote and availability for a consultation call. No commitment required."
            : "No payment required at this stage. We'll confirm your spot and pricing before any commitment."}
        </p>
      </div>
    </form>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="divider">
      <div className="divider-line" />
      <div className="divider-text">{label}</div>
      <div className="divider-line" />
    </div>
  );
}

function FormInput({ name, label, type = "text", placeholder, required }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && <span className="req">*</span>}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}
function FormTextarea({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} placeholder={placeholder} />
    </div>
  );
}
function FormSelect({ name, label, options, required, placeholder }: { name: string; label: string; options: SelectOption[]; required?: boolean; placeholder?: string }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && <span className="req">*</span>}</label>
      <select id={name} name={name} required={required} defaultValue="">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
function CheckGroup({ label, options, selected, onToggle }: { label: string; options: CheckOption[]; selected: string[]; onToggle: (label: string) => void }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="check-grid">
        {options.map((o) => {
          const checked = selected.includes(o.label);
          return (
            <button type="button" key={o.label}
              className={`check-item ${checked ? "checked" : ""}`}
              onClick={() => onToggle(o.label)}>
              <span className="check-box" />
              <span className="check-label">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
function VibeGroup({ label, required, vibes, selected, onToggle }: { label: string; required?: boolean; vibes: VibeOption[]; selected: string[]; onToggle: (name: string) => void }) {
  return (
    <div className="form-group">
      <label>{label} {required && <span className="req">*</span>}</label>
      <div className="vibe-grid">
        {vibes.map((v) => {
          const sel = selected.includes(v.name);
          return (
            <button type="button" key={v.name}
              className={`vibe-card ${sel ? "selected" : ""}`}
              onClick={() => onToggle(v.name)}>
              <span className="vibe-icon">{v.icon}</span>
              <span className="vibe-name">{v.name}</span>
              <span className="vibe-desc">{v.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}