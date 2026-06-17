import { TourHeroCTAButtons } from "@/components/tour/TourHeroCTA";

interface Props {
  t: (path: string) => any;
}

export function TourHero({ t }: Props) {
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
        <TourHeroCTAButtons t={t} />
      </div>
    </section>
  );
}