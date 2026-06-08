import { useState, FormEvent, useMemo } from "react";
import { Loader2 } from "lucide-react";

export type InlineFormVariant = "private" | "waitlist";
type T = (path: string) => any;

interface CheckOption { label: string; value?: string; price?: number; }
interface VibeOption { icon: string; name: string; desc: string; }
interface SelectOption { value: string; label: string; }

// Stable, language-agnostic identifiers (used as form values).
const VIBE_ICONS = ["📊", "🌿", "🌊", "🏙", "🌲", "✨"];
const PRIVATE_DEST_VALUES = [
  "lisbon", "lisbon_setubal", "lisbon_algarve", "lisbon_porto",
  "porto", "algarve", "cabo_verde_single", "cabo_verde_multi",
  "portugal_cabo_verde", "custom",
];
const HOTEL_VALUES = ["3", "4", "5"];
const WAITLIST_DEST_VALUES = ["Portugal", "Cabo Verde", "Both", "Undecided"];
const WAITLIST_TYPE_VALUES = ["group", "private", "both"];

interface Props {
  variant: InlineFormVariant;
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
  isSubmitting: boolean;
  submitted: boolean;
  t: T;
}

export default function InlineTourForm({ variant, onSubmit, isSubmitting, submitted, t }: Props) {
  const [vibes, setVibes] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const isPrivate = variant === "private";

  const MAX_VIBES = 3;
  const [vibeWarning, setVibeWarning] = useState(false);

  const VIBES: VibeOption[] = useMemo(() => {
    const arr = (t("inline_form.vibes") as Array<{ name: string; desc: string }>) || [];
    return arr.map((v, i) => ({ icon: VIBE_ICONS[i] || "•", name: v.name, desc: v.desc }));
  }, [t]);

  const PRIVATE_DAYS: SelectOption[] = useMemo(() => {
    const d = t("inline_form.day_singular");
    const dd = t("inline_form.day_plural");
    return Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1), label: `${i + 1} ${i === 0 ? d : dd}`,
    }));
  }, [t]);

  const PRIVATE_GUESTS: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.guests") as string[]) || [];
    return labels.map((label, i) => ({ value: String(i + 1), label }));
  }, [t]);

  const PRIVATE_DESTS: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.private_destinations") as string[]) || [];
    return PRIVATE_DEST_VALUES.map((value, i) => ({ value, label: labels[i] || value }));
  }, [t]);

  const HOTEL_OPTS: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.hotel_opts") as string[]) || [];
    return HOTEL_VALUES.map((value, i) => ({ value, label: labels[i] || value }));
  }, [t]);

  const BUDGETS: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.budgets") as string[]) || [];
    return labels.map((label) => ({ value: label, label }));
  }, [t]);

  const PROP_TYPES: CheckOption[] = useMemo(
    () => ((t("inline_form.property_types_opts") as string[]) || []).map((label) => ({ label })),
    [t],
  );
  const SERVICES: CheckOption[] = useMemo(
    () => ((t("inline_form.services_opts") as string[]) || []).map((label) => ({ label })),
    [t],
  );
  const WAITLIST_SERVICES: CheckOption[] = useMemo(
    () => ((t("inline_form.waitlist_services_opts") as string[]) || []).map((label) => ({ label })),
    [t],
  );
  const WAITLIST_DESTS: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.waitlist_destinations") as string[]) || [];
    return WAITLIST_DEST_VALUES.map((value, i) => ({ value, label: labels[i] || value }));
  }, [t]);
  const WAITLIST_TYPES: SelectOption[] = useMemo(() => {
    const labels = (t("inline_form.waitlist_types") as string[]) || [];
    return WAITLIST_TYPE_VALUES.map((value, i) => ({ value, label: labels[i] || value }));
  }, [t]);
  const GROUP_THEMES: CheckOption[] = useMemo(
    () => ((t("inline_form.group_themes") as string[]) || []).map((label) => ({ label })),
    [t],
  );

  const toggleVibe = (name: string) => {
    setVibes((curr) => {
      if (curr.includes(name)) {
        setVibeWarning(false);
        return curr.filter((v) => v !== name);
      }
      if (isPrivate && curr.length >= MAX_VIBES) {
        setVibeWarning(true);
        return curr;
      }
      setVibeWarning(false);
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
    const succ = t("inline_form.success");
    return (
      <div className="success-msg shown">
        <div className="success-icon">{isPrivate ? "✉️" : "🎯"}</div>
        <h4>{isPrivate ? succ.private_title : succ.waitlist_title}</h4>
        <p>{isPrivate ? succ.private_body : succ.waitlist_body}</p>
        <p className="success-sign">{succ.sign}</p>
      </div>
    );
  }

  const f = t("inline_form.fields");
  const header = t("inline_form.header");
  const dividers = t("inline_form.dividers");
  const submit = t("inline_form.submit");
  const vibeLabel = isPrivate
    ? String(f.vibe).replace("{n}", String(MAX_VIBES))
    : f.vibe_waitlist;
  const warningText = String(f.vibe_warning).replace("{n}", String(MAX_VIBES));

  return (
    <form className="form-wrap" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{isPrivate ? header.private_title : header.waitlist_title}</h3>
        <p>
          {isPrivate
            ? <>{header.private_intro_a} <span className="req">*</span> {header.private_intro_b}</>
            : header.waitlist_intro}
        </p>
      </div>

      <Divider label={isPrivate ? dividers.about_you : dividers.contact_info} />
      <div className="form-row">
        <FormInput name="first_name" label={f.first_name} required placeholder={f.first_name_ph} />
        <FormInput name="last_name" label={f.last_name} required placeholder={f.last_name_ph} />
      </div>
      <div className="form-row">
        <FormInput name="email" type="email" label={f.email} required placeholder={f.email_ph} />
        <FormInput name="whatsapp" type="tel" label={f.whatsapp} required placeholder={f.whatsapp_ph} />
      </div>
      <div className="form-row">
        <FormInput name="country" label={f.country} required placeholder={f.country_ph} />
        <FormInput name="nationality" label={f.nationality} placeholder={f.nationality_ph} />
      </div>

      {isPrivate ? (
        <>
          <Divider label={dividers.trip_details} />
          <div className="form-row">
            <FormSelect name="days" label={f.days} required options={PRIVATE_DAYS} placeholder={f.days_ph} />
            <FormSelect name="guests" label={f.guests} required options={PRIVATE_GUESTS} placeholder={f.guests_ph} />
          </div>
          <div className="form-row">
            <FormInput name="date1" label={f.date1} placeholder={f.date1_ph} />
            <FormInput name="date2" label={f.date2} placeholder={f.date2_ph} />
          </div>
          <FormSelect name="destination" label={f.destination} required options={PRIVATE_DESTS} placeholder={f.destination_ph} />

          <VibeGroup
            label={vibeLabel}
            required
            vibes={VIBES}
            selected={vibes}
            onToggle={toggleVibe}
            warning={vibeWarning ? warningText : undefined}
          />

          <CheckGroup label={f.property_types} options={PROP_TYPES}
            selected={checks.propertyTypes || []} onToggle={(l) => toggleCheck("propertyTypes", l)} />

          <CheckGroup label={f.services} options={SERVICES}
            selected={checks.services || []} onToggle={(l) => toggleCheck("services", l)} />

          <FormSelect name="hotel" label={f.hotel} options={HOTEL_OPTS} />
          <FormSelect name="budget" label={f.budget} options={BUDGETS} placeholder={f.budget_ph} />
          <FormTextarea name="notes_extra" label={f.notes_extra} placeholder={f.notes_extra_ph} />
        </>
      ) : (
        <>
          <Divider label={dividers.your_goals} />
          <div className="form-row">
            <FormSelect name="destination" label={f.destination_waitlist} required options={WAITLIST_DESTS} placeholder={f.destination_ph} />
            <FormInput name="travel_window" label={f.travel_window} placeholder={f.travel_window_ph} />
          </div>
          <VibeGroup label={vibeLabel} vibes={VIBES} selected={vibes} onToggle={toggleVibe} />
          <CheckGroup label={f.themes} options={GROUP_THEMES}
            selected={checks.themes || []} onToggle={(l) => toggleCheck("themes", l)} />
          <CheckGroup label={f.services_waitlist} options={WAITLIST_SERVICES}
            selected={checks.services || []} onToggle={(l) => toggleCheck("services", l)} />
          <div className="form-row">
            <FormSelect name="budget" label={f.budget} options={BUDGETS} placeholder={f.budget_ph} />
            <FormSelect name="preference" label={f.preference} options={WAITLIST_TYPES} placeholder={f.preference_ph} />
          </div>
          <FormTextarea name="notes_extra" label={f.notes_extra_waitlist} placeholder={f.notes_extra_waitlist_ph} />
        </>
      )}

      <div className="form-submit">
        <button type="submit" className="btn-form-submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isPrivate ? submit.private : submit.waitlist}
        </button>
        <p className="form-foot-note">
          {isPrivate ? submit.private_note : submit.waitlist_note}
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
function VibeGroup({ label, required, vibes, selected, onToggle, warning }: { label: string; required?: boolean; vibes: VibeOption[]; selected: string[]; onToggle: (name: string) => void; warning?: string }) {
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
      {warning && <p className="vibe-warning" role="status">{warning}</p>}
    </div>
  );
}
