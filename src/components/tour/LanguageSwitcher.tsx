import type { Language } from "@/pages/TourTranslations";

interface Props {
  current: Language;
  onChange: (l: Language) => void;
}

export function LanguageSwitcher({ current, onChange }: Props) {
  const langs: { key: Language; label: string }[] = [
    { key: "en", label: "EN" },
    { key: "pt", label: "PT" },
    { key: "fr", label: "FR" },
  ];
  return (
    <div className="lang-switcher">
      {langs.map((l) => (
        <button
          key={l.key}
          className={`lang-btn ${current === l.key ? "active" : ""}`}
          onClick={() => onChange(l.key)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}