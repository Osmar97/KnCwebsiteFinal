import { Reveal } from "@/components/tour/Reveal";
import { INCLUDES } from "@/components/tour/tour-data";
import { formatPrice } from "@/lib/formatPrice";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { Instagram } from "lucide-react";

type T = (path: string) => any;

export function IncludesSection({ t }: { t: T }) {
  const items = (t("includes_section.items") as Array<{ title: string }>) || [];
  return (
    <section className="includes-section">
      <div className="t-container">
        <div className="section-eyebrow">{t("includes_section.eyebrow")}</div>
        <h2 className="section-title">{t("includes_section.title_1")}<br /><em>{t("includes_section.title_2")}</em></h2>
        <Reveal>
          <div className="includes-grid">
            {INCLUDES.map((item, i) => (
              <div key={i} className="include-card">
                <span className="include-icon">{item.icon}</span>
                <div className="include-title">{items[i]?.title ?? item.title}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface TwoWaysProps {
  privateFromPrice: number | null;
  groupFromPrice: number | null;
  defaultCurrency: string;
  t: T;
  onScrollTo: (id: string) => void;
}
export function TwoWaysSection({ privateFromPrice, groupFromPrice, defaultCurrency, t, onScrollTo }: TwoWaysProps) {
  const privateMeta = (t("two_ways.private.meta") as string[]) || [];
  const groupMeta = (t("two_ways.group.meta") as string[]) || [];
  const privateFrom = t("two_ways.private.from") as string;
  const groupFrom = t("two_ways.group.from") as string;
  const privatePriceText = privateFromPrice !== null
    ? privateFrom.replace("{price}", formatPrice(privateFromPrice, defaultCurrency))
    : t("two_ways.private.custom");
  const groupPriceText = groupFromPrice !== null
    ? groupFrom.replace("{price}", formatPrice(groupFromPrice, defaultCurrency))
    : t("two_ways.group.soon");
  return (
    <section className="tour-types" id="overview">
      <div className="t-container">
        <div className="section-eyebrow light">{t("two_ways.eyebrow")}</div>
        <h2 className="section-title light">{t("two_ways.title_1")}<br /><em>{t("two_ways.title_2")}</em></h2>
        <Reveal>
          <div className="tour-format-grid">
            <a href="#private" className="format-card" onClick={(e) => { e.preventDefault(); onScrollTo("private"); }}>
              <span className="format-label">{t("two_ways.private.label")}</span>
              <h3>{t("two_ways.private.title")}</h3>
              <p>{t("two_ways.private.desc")}</p>
              <div className="format-meta">
                {privateMeta.map((item, i) => (
                  <div key={i} className="fmeta-item"><span className="fmeta-dot" />{item}</div>
                ))}
              </div>
              <div className="format-price">{privatePriceText}</div>
              <div className="format-arrow">→</div>
            </a>
            <a href="#waitlist" className="format-card" onClick={(e) => { e.preventDefault(); onScrollTo("waitlist"); }}>
              <span className="format-label">{t("two_ways.group.label")}</span>
              <h3>{t("two_ways.group.title")}</h3>
              <p>{t("two_ways.group.desc")}</p>
              <div className="format-meta">
                {groupMeta.map((item, i) => (
                  <div key={i} className="fmeta-item"><span className="fmeta-dot" />{item}</div>
                ))}
              </div>
              <div className="format-price">{groupPriceText}</div>
              <div className="format-arrow">→</div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import type { WhereWeGoCard } from "@/data/whereWeGo";
import type { Language } from "@/pages/TourTranslations";

interface DestinationsProps {
  cards: WhereWeGoCard[];
  loading: boolean;
  lang: Language;
  t: T;
}
function pickField(card: WhereWeGoCard, base: "country_name" | "subtitle" | "description", lang: Language): string {
  const key = `${base}_${lang}` as keyof WhereWeGoCard;
  const fallback = `${base}_en` as keyof WhereWeGoCard;
  const value = (card[key] as string | null) || (card[fallback] as string | null);
  return (value ?? "").toString();
}
export function DestinationsSection({ cards, loading, lang, t }: DestinationsProps) {
  return (
    <section className="dest-section" id="destinations">
      <div className="t-container">
        <div className="section-eyebrow">{t("destinations_section.eyebrow")}</div>
        <h2 className="section-title">{t("destinations_section.title_1")}<br /><em>{t("destinations_section.title_2")}</em></h2>
        <Reveal>
          <div className="dest-grid">
            {cards.length === 0 && !loading && (
              <p style={{ opacity: 0.6 }}>{t("destinations_section.empty")}</p>
            )}
            {cards.map((c) => {
              const country = pickField(c, "country_name", lang);
              const subtitle = pickField(c, "subtitle", lang);
              const description = pickField(c, "description", lang);
              return (
                <div key={c.id ?? country} className="dest-card">
                  {c.image_url ? (
                    <div
                      className="dest-bg-inner"
                      style={{
                        backgroundImage: `url(${c.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="dest-bg-inner db-lisbon" />
                  )}
                  <div className="dest-ov" />
                  <div className="dest-cnt">
                    <div className="dest-ctry">{country}</div>
                    <div className="dest-name">{country}</div>
                    <div className="dest-detail">{subtitle || description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorksSection({ t }: { t: T }) {
  const steps = (t("how_section.steps") as Array<{ title: string; body: string }>) || [];
  return (
    <div className="how-section" id="how">
      <div className="how-sticky">
        <div className="how-eyebrow">{t("how_section.eyebrow")}</div>
        <h2>{t("how_section.title_1")}<br />{t("how_section.title_2")}<em>{t("how_section.title_3")}</em></h2>
        <p>{t("how_section.intro")}</p>
      </div>
      <div>
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="how-step">
              <div className="hs-n">{String(i + 1).padStart(2, "0")}</div>
              <div className="hs-b">
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function InstagramShowcaseSection({ t }: { t: T }) {
  const { links, images, loading } = useSocialMedia();

  const instagramUrl = links?.instagram_url || "https://www.instagram.com/ismaelgq_";
  const username = links?.instagram_username || "ismaelgq_";

  const grid = images.slice(0, 6);

  return (
    <section className="ig-section">
      <div className="t-container">
        <Reveal className="ig-head">
          <div className="section-eyebrow">{t("instagram.eyebrow")}</div>
          <h2 className="ig-title">
            {t("instagram.heading_1")}<em>{t("instagram.heading_2")}</em>
          </h2>
          <p className="ig-desc">{t("instagram.body")}</p>
        </Reveal>

        <Reveal>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-profile"
            aria-label={`${t("instagram.open_profile")} @${username}`}
          >
            <div className="ig-avatar" aria-hidden="true">
              <Instagram className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="ig-profile-meta">
              <div className="ig-profile-name">Kings 'n Company</div>
              <div className="ig-profile-handle">@{username}</div>
            </div>
            <span className="ig-follow-btn">{t("instagram.follow")}</span>
          </a>
        </Reveal>

        <div className="ig-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="ig-tile ig-skeleton" aria-hidden="true" />)
            : grid.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <a
                    key={i}
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-tile ig-tile-empty"
                    aria-label={t("instagram.open_profile")}
                  >
                    <Instagram className="w-6 h-6" strokeWidth={1.4} />
                  </a>
                ))
              : grid.map((img, i) => (
                  <a
                    key={img.id ?? i}
                    href={img.post_url || instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-tile"
                    aria-label={img.caption || t("instagram.view_post")}
                  >
                    <img src={img.image_url} alt={img.caption || ""} loading="lazy" />
                    <span className="ig-tile-overlay" aria-hidden="true">
                      <Instagram className="w-6 h-6" strokeWidth={1.5} />
                    </span>
                  </a>
                ))}
        </div>

        <Reveal className="ig-cta-row">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ig-cta">
            <Instagram className="w-4 h-4" strokeWidth={1.6} />
            <span>{t("instagram.cta")}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}