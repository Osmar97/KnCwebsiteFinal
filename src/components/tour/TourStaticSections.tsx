import { Reveal } from "@/components/tour/Reveal";
import { INCLUDES } from "@/components/tour/tour-data";
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