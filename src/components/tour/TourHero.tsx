import { Loader2 } from "lucide-react";

interface Props {
  t: (path: string) => string;
  destinationsCount: number;
  groupThemesCount: number;
  onReserve: () => void;
  isCheckingOut: boolean;
}

export function TourHero({ t, destinationsCount, groupThemesCount, onReserve, isCheckingOut }: Props) {
  return (
    <section className="hero-section">
      <div className="hero-grain" />
      <div className="hero-radial" />
      <div className="hero-content">
        <div className="hero-eyebrow">{t("hero.label")}</div>
        <h1 className="hero-h1">
          {t("hero.h1_line1")}<br />
          <em>{t("hero.h1_line2")}</em><br />
          {t("hero.h1_line3")}
        </h1>
        <p className="hero-sub">{t("hero.sub")}</p>
        <div className="hero-ctas">
          <button onClick={onReserve} disabled={isCheckingOut} className="btn-primary">
            {isCheckingOut && <Loader2 size={14} className="animate-spin" />}
            {isCheckingOut ? "Processing..." : "Book Private Tour"}
          </button>
          <a href="#group" className="btn-outline">Join a Group Tour</a>
        </div>
      </div>
      <div className="hero-stats">
        <div className="h-stat">
          <span className="h-stat-n">{destinationsCount || "—"}</span>
          <span className="h-stat-l">Destinations</span>
        </div>
        <div className="h-stat">
          <span className="h-stat-n">{groupThemesCount || "—"}</span>
          <span className="h-stat-l">Group Themes</span>
        </div>
        <div className="h-stat">
          <span className="h-stat-n">1–10</span>
          <span className="h-stat-l">Days, Private</span>
        </div>
      </div>
    </section>
  );
}