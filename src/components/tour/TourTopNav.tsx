import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Language } from "@/pages/TourTranslations";

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  t: (path: string) => string;
  onReserve: () => void;
  isCheckingOut: boolean;
}

export function TourTopNav({ lang, setLang, t, onReserve, isCheckingOut }: Props) {
  const navigate = useNavigate();
  return (
    <nav className="tnav">
      <div className="tnav-left">
        <button className="back-btn" onClick={() => navigate("/services")} title={t("back")}>
          <ArrowLeft size={16} />
          <span>{t("back")}</span>
        </button>
        <a href="#top" className="tnav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="tnav-logo-mark">KnC</div>
          <div className="tnav-logo-text">
            Kings 'n Company
            <span>Property Ownership Tours</span>
          </div>
        </a>
      </div>
      <ul className="tnav-links">
        <li><a href="#tours">{t("nav.tours")}</a></li>
        <li><a href="#destinations">{t("nav.destinations")}</a></li>
        <li><a href="#how">{t("nav.how")}</a></li>
        <li><a href="#testimonials">{t("nav.stories")}</a></li>
      </ul>
      <div className="tnav-right">
        <LanguageSwitcher current={lang} onChange={setLang} />
        <button className="tnav-cta" onClick={onReserve} disabled={isCheckingOut}>
          {t("nav.cta")}
        </button>
      </div>
    </nav>
  );
}