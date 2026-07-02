import { Reveal } from "@/components/tour/Reveal";
import { INCLUDES } from "@/components/tour/tour-data";
import { formatPrice } from "@/lib/formatPrice";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import {
  fetchIgImagesPublic,
  fetchSocialLinks,
  type IgImage,
  type SocialLinks,
} from "@/data/socialMedia";

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

// ── INSTAGRAM SHOWCASE ────────────────────────────────────────────────

const DEFAULT_IG_HANDLE = "kingsncompany";
const DEFAULT_IG_URL = "https://www.instagram.com/kingsncompany";

export function InstagramShowcaseSection({ t }: { t: T }) {
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [images, setImages] = useState<IgImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchSocialLinks(), fetchIgImagesPublic()])
      .then(([l, imgs]) => {
        if (!mounted) return;
        setLinks(l);
        setImages(imgs.slice(0, 6));
      })
      .catch(() => { if (mounted) { setLinks(null); setImages([]); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const profileUrl = links?.instagram_url?.trim() || DEFAULT_IG_URL;
  const username = links?.instagram_username?.trim() || DEFAULT_IG_HANDLE;
  const tiles: (IgImage | null)[] = images.length
    ? images
    : Array.from({ length: 6 }, () => null);

  return (
    <section className="ig-section" id="instagram">
      <div className="t-container">
        <div className="ig-head">
          <div className="section-eyebrow">{t("instagram.eyebrow")}</div>
          <h2 className="ig-title">
            {t("instagram.heading_1")}<em>{t("instagram.heading_2")}</em>
          </h2>
          <p className="ig-desc">{t("instagram.body")}</p>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-profile"
          aria-label={t("instagram.open_profile")}
        >
          <span className="ig-avatar" aria-hidden="true">
            <Instagram size={26} strokeWidth={1.6} />
          </span>
          <span className="ig-profile-meta">
            <span className="ig-profile-name">Kings 'n Company</span>
            <span className="ig-profile-handle">@{username}</span>
          </span>
          <span className="ig-follow-btn">{t("instagram.follow")}</span>
        </a>

        <Reveal>
          <div className="ig-grid">
            {tiles.map((tile, i) => {
              if (!tile) {
                return (
                  <div
                    key={`ph-${i}`}
                    className={`ig-tile ${loading ? "ig-skeleton" : "ig-tile-empty"}`}
                    aria-hidden="true"
                  >
                    {!loading && <Instagram size={22} strokeWidth={1.4} />}
                  </div>
                );
              }
              const href = tile.post_url?.trim() || profileUrl;
              const caption = tile.caption?.trim() || "";
              return (
                <a
                  key={tile.id ?? i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-tile-card"
                  aria-label={caption || t("instagram.view_post")}
                >
                  <div className="ig-tile">
                    <img src={tile.image_url} alt={caption || "Instagram post"} loading="lazy" />
                    <span className="ig-tile-overlay">
                      <Instagram size={26} strokeWidth={1.6} />
                    </span>
                  </div>
                  {caption && <p className="ig-tile-caption">{caption}</p>}
                </a>
              );
            })}
          </div>
        </Reveal>

        <div className="ig-cta-row">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="ig-cta">
            <Instagram size={16} strokeWidth={1.8} />
            {t("instagram.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
