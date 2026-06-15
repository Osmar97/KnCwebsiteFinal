export function Steps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="ptf-steps">
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className={`ptf-step ${i < labels.length - 1 ? "ptf-step-flex" : ""}`}>
            <div className="ptf-step-marker">
              <div className={`ptf-step-circle ${done ? "is-done" : active ? "is-active" : ""}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`ptf-step-label ${active ? "is-active" : done ? "is-done" : ""}`}>{label}</span>
            </div>
            {i < labels.length - 1 && <div className={`ptf-step-line ${done ? "is-done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="ptf-label">{children}</div>;
}

export function FieldInput({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        className="ptf-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ptf-summary-row">
      <span className="ptf-summary-label">{label}</span>
      <span className="ptf-summary-value">{value}</span>
    </div>
  );
}