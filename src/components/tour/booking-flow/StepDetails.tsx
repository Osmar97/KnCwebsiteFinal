import type { AddonRow, DestinationRow } from "@/hooks/usePrivateTourConfig";
import { FieldInput, Label } from "./Steps";
import { PriceSummary } from "./PriceSummary";
import { tt, type T } from "./format";

interface Props {
  t: T;
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  nationality: string; setNationality: (v: string) => void;
  budget: string; setBudget: (v: string) => void;
  message: string; setMessage: (v: string) => void;
  destination: DestinationRow | undefined;
  days: number;
  persons: number;
  selectedAddons: AddonRow[];
}

export function StepDetails({
  t, name, setName, email, setEmail, phone, setPhone, nationality, setNationality,
  budget, setBudget, message, setMessage, destination, days, persons, selectedAddons,
}: Props) {
  const f = {
    name: tt(t, "private_tour_flow.details.name", "Full name *"),
    name_ph: tt(t, "private_tour_flow.details.name_ph", "As on your passport"),
    email: tt(t, "private_tour_flow.details.email", "Email address *"),
    email_ph: tt(t, "private_tour_flow.details.email_ph", "Your best email"),
    phone: tt(t, "private_tour_flow.details.phone", "WhatsApp / phone *"),
    phone_ph: tt(t, "private_tour_flow.details.phone_ph", "+44 or +1 with country code"),
    nat: tt(t, "private_tour_flow.details.nationality", "Nationality"),
    nat_ph: tt(t, "private_tour_flow.details.nat_ph", "e.g. British, American, French"),
    budget: tt(t, "private_tour_flow.details.budget", "Approximate budget for property purchase"),
    budget_ph: tt(t, "private_tour_flow.details.budget_ph", "e.g. 300.000–500.000€"),
    msg: tt(t, "private_tour_flow.details.message", "Anything specific you want us to know?"),
    msg_ph: tt(t, "private_tour_flow.details.message_ph", "Investment goals, property type preferences, family situation, questions you already have..."),
  };
  return (
    <div>
      <h3 className="ptf-h2">{tt(t, "private_tour_flow.details.title", "Your details")}</h3>
      <p className="ptf-sub">{tt(t, "private_tour_flow.details.subtitle", "A few things to help us prepare for you specifically.")}</p>
      <div className="ptf-form-grid">
        <FieldInput label={f.name} value={name} onChange={setName} placeholder={f.name_ph} />
        <FieldInput label={f.email} value={email} onChange={setEmail} placeholder={f.email_ph} type="email" />
        <FieldInput label={f.phone} value={phone} onChange={setPhone} placeholder={f.phone_ph} />
        <FieldInput label={f.nat} value={nationality} onChange={setNationality} placeholder={f.nat_ph} />
        <div className="ptf-form-full">
          <FieldInput label={f.budget} value={budget} onChange={setBudget} placeholder={f.budget_ph} />
        </div>
        <div className="ptf-form-full">
          <Label>{f.msg}</Label>
          <textarea
            className="ptf-textarea"
            value={message}
            maxLength={2000}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={f.msg_ph}
            rows={4}
          />
        </div>
      </div>
      <div className="ptf-mt-24">
        <PriceSummary destination={destination} days={days} persons={persons} selectedAddons={selectedAddons} t={t} />
      </div>
    </div>
  );
}