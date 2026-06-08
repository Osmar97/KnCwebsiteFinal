import { Reveal } from "@/components/tour/Reveal";
import { INCLUDES, TESTIMONIALS } from "@/components/tour/tour-data";
import { formatPrice } from "@/lib/formatPrice";
import { useToast } from "@/hooks/use-toast";

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
}
export function TwoWaysSection({ privateFromPrice, groupFromPrice, defaultCurrency, t }: TwoWaysProps) {
  const priv = t("two_ways.private");
  const grp = t("two_ways.group");
  const privMeta = (priv.meta as string[]) || [];
  const grpMeta = (grp.meta as string[]) || [];
  return (
    <section className="tour-types" id="overview">
      <div className="t-container">
        <div className="section-eyebrow light">{t("two_ways.eyebrow")}</div>
        <h2 className="section-title light">{t("two_ways.title_1")}<br /><em>{t("two_ways.title_2")}</em></h2>
        <Reveal>
          <div className="tour-format-grid">
            <a href="#private" className="format-card">
              <span className="format-label">{priv.label}</span>
              <h3>{priv.title}</h3>
              <p>{priv.desc}</p>
              <div className="format-meta">
                {privMeta.map((m, i) => (
                  <div key={i} className="fmeta-item"><span className="fmeta-dot" />{m}</div>
                ))}
              </div>
              <div className="format-price">
                {privateFromPrice !== null
                  ? String(priv.from).replace("{price}", formatPrice(privateFromPrice, defaultCurrency))
                  : priv.custom}
              </div>
              <div className="format-arrow">→</div>
            </a>
            <a href="#group" className="format-card">
              <span className="format-label">{grp.label}</span>
              <h3>{grp.title}</h3>
              <p>{grp.desc}</p>
              <div className="format-meta">
                {grpMeta.map((m, i) => (
                  <div key={i} className="fmeta-item"><span className="fmeta-dot" />{m}</div>
                ))}
              </div>
              <div className="format-price">
                {groupFromPrice !== null
                  ? String(grp.from).replace("{price}", formatPrice(groupFromPrice, defaultCurrency))
                  : grp.soon}
              </div>
              <div className="format-arrow">→</div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface DestinationsProps {
  destinations: { key: string; bgClass: string; country: string; name: string; detail: string }[];
  loading: boolean;
  t: T;
}
export function DestinationsSection({ destinations, loading, t }: DestinationsProps) {
  return (
    <section className="dest-section" id="destinations">
      <div className="t-container">
        <div className="section-eyebrow">{t("destinations_section.eyebrow")}</div>
        <h2 className="section-title">{t("destinations_section.title_1")}<br /><em>{t("destinations_section.title_2")}</em></h2>
        <Reveal>
          <div className="dest-grid">
            {destinations.length === 0 && !loading && (
              <p style={{ opacity: 0.6 }}>{t("destinations_section.empty")}</p>
            )}
            {destinations.map((d) => (
              <div key={d.key} className="dest-card">
                <div className={`dest-bg-inner ${d.bgClass}`} />
                <div className="dest-ov" />
                <div className="dest-cnt">
                  <div className="dest-ctry">{d.country}</div>
                  <div className="dest-name">{d.name}</div>
                  <div className="dest-detail">{d.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorksSection({ t }: { t: T }) {
  const steps = (t("how_section.steps") as Array<{ title: string; body: string }>) || [];
  const reportTags = (t("how_section.report_tags") as string[]) || [];
  return (
    <div className="how-section" id="how">
      <div className="how-sticky">
        <div className="how-eyebrow">{t("how_section.eyebrow")}</div>
        <h2>{t("how_section.title_1")}<br />{t("how_section.title_2")}<em>{t("how_section.title_3")}</em></h2>
        <p>{t("how_section.intro")}</p>
        <div className="report-card">
          <div className="report-card-head">{t("how_section.report_head")}</div>
          <div className="report-card-body">
            <h3>{t("how_section.report_title")}</h3>
            <p>{t("how_section.report_meta")}</p>
            <div className="report-tags">
              {reportTags.map((tag, i) => (
                <span key={i} className="report-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
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

export function TestimonialsSection({ t }: { t: T }) {
  const items = (t("testimonials_section.items") as Array<{ text: string; origin: string }>) || [];
  return (
    <section className="test-section" id="testimonials">
      <div className="t-container">
        <div className="section-eyebrow">{t("testimonials_section.eyebrow")}</div>
        <h2 className="section-title">{t("testimonials_section.title_1")}<br /><em>{t("testimonials_section.title_2")}</em></h2>
        <Reveal>
          <div className="test-grid">
            {TESTIMONIALS.map((test, i) => (
              <div key={test.initials} className="test-card">
                <div className="tq">"</div>
                <p className="tt">{items[i]?.text ?? test.text}</p>
                <div className="ta">
                  <div className={`ta-av ${test.avClass}`}>{test.initials}</div>
                  <div>
                    <div className="ta-name">{test.name}</div>
                    <div className="ta-orig">{items[i]?.origin ?? test.origin}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function NewsletterSection({ t }: { t: T }) {
  const { toast } = useToast();
  return (
    <section className="nl-section">
      <div className="t-container nl-grid">
        <Reveal className="nl-text">
          <div className="section-eyebrow">{t("newsletter.eyebrow")}</div>
          <h2>
            {t("newsletter.heading_1")}<em>{t("newsletter.heading_2")}</em>
          </h2>
          <p>{t("newsletter.body")}</p>
        </Reveal>
        <Reveal>
          <form
            className="nl-form"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
              if (input?.value) {
                toast({ title: t("newsletter.success_title"), description: t("newsletter.success_desc") });
                input.value = "";
              }
            }}
          >
            <div className="nl-row">
              <input type="email" name="email" required placeholder={t("newsletter.placeholder")} />
              <button type="submit">{t("newsletter.cta")}</button>
            </div>
            <p className="nl-note">{t("newsletter.note")}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}