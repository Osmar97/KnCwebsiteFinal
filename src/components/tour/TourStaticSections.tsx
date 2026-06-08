import { Reveal } from "@/components/tour/Reveal";
import { HOW_STEPS, INCLUDES, TESTIMONIALS } from "@/components/tour/tour-data";
import { formatPrice, formatPriceShort } from "@/lib/formatPrice";
import { useToast } from "@/hooks/use-toast";

type T = (path: string) => string;

export function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="sb"><div className="sb-n">47+</div><div className="sb-l">Investors Hosted</div></div>
      <div className="sb"><div className="sb-n">2</div><div className="sb-l">Countries</div></div>
      <div className="sb"><div className="sb-n">{formatPriceShort(260000, "EUR")}</div><div className="sb-l">Avg Deal Size</div></div>
      <div className="sb"><div className="sb-n">100%</div><div className="sb-l">Guided End-to-End</div></div>
    </div>
  );
}

export function IncludesSection() {
  return (
    <section className="includes-section">
      <div className="t-container">
        <div className="section-eyebrow">Every Tour</div>
        <h2 className="section-title">What comes<br /><em>standard</em></h2>
        <Reveal>
          <div className="includes-grid">
            {INCLUDES.map((item) => (
              <div key={item.title} className="include-card">
                <span className="include-icon">{item.icon}</span>
                <div className="include-title">{item.title}</div>
                <p className="include-desc">{item.desc}</p>
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
}
export function TwoWaysSection({ privateFromPrice, groupFromPrice, defaultCurrency }: TwoWaysProps) {
  return (
    <section className="tour-types" id="overview">
      <div className="t-container">
        <div className="section-eyebrow light">Choose Your Format</div>
        <h2 className="section-title light">Two ways to<br /><em>explore</em></h2>
        <Reveal>
          <div className="tour-format-grid">
            <a href="#private" className="format-card">
              <span className="format-label">Fully Customized</span>
              <h3>Private Tour</h3>
              <p>Built entirely around your goals, timeline, and preferred vibe. You choose where, how long, what services you need, and what type of properties you want to see.</p>
              <div className="format-meta">
                <div className="fmeta-item"><span className="fmeta-dot" />1 to 10 days</div>
                <div className="fmeta-item"><span className="fmeta-dot" />Portugal or Cabo Verde</div>
                <div className="fmeta-item"><span className="fmeta-dot" />Up to 4 people</div>
                <div className="fmeta-item"><span className="fmeta-dot" />Add lawyer, mortgage, accountant</div>
              </div>
              <div className="format-price">
                {privateFromPrice !== null
                  ? `From ${formatPrice(privateFromPrice, defaultCurrency)} / person`
                  : "Custom pricing on enquiry"}
              </div>
              <div className="format-arrow">→</div>
            </a>
            <a href="#group" className="format-card">
              <span className="format-label">Themed Itineraries</span>
              <h3>Group Tour</h3>
              <p>Join a curated group of 5–9 investors with a shared vibe. Ten preset themes, from coastal to cosmopolitan. We launch the trip when the group fills.</p>
              <div className="format-meta">
                <div className="fmeta-item"><span className="fmeta-dot" />3 or 5 days</div>
                <div className="fmeta-item"><span className="fmeta-dot" />5–9 participants</div>
                <div className="fmeta-item"><span className="fmeta-dot" />10 preset themes</div>
                <div className="fmeta-item"><span className="fmeta-dot" />Pre-trip 1-on-1 call included</div>
              </div>
              <div className="format-price">
                {groupFromPrice !== null
                  ? `From ${formatPrice(groupFromPrice, defaultCurrency)} / person`
                  : "Pricing announced soon"}
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
}
export function DestinationsSection({ destinations, loading }: DestinationsProps) {
  return (
    <section className="dest-section" id="destinations">
      <div className="t-container">
        <div className="section-eyebrow">Where We Go</div>
        <h2 className="section-title">Two countries.<br /><em>Endless opportunity.</em></h2>
        <Reveal>
          <div className="dest-grid">
            {destinations.length === 0 && !loading && (
              <p style={{ opacity: 0.6 }}>Destinations will appear here when tours are published.</p>
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

export function HowItWorksSection() {
  return (
    <div className="how-section" id="how">
      <div className="how-sticky">
        <div className="how-eyebrow">The KnC Process</div>
        <h2>From Inquiry<br />to <em>Keys in Hand.</em></h2>
        <p>We built a proven system so diaspora investors never navigate a foreign property market alone. Bilingual. Transparent. Built for you.</p>
        <div className="report-card">
          <div className="report-card-head">Lisbon</div>
          <div className="report-card-body">
            <h3>Sample Post-Tour Report</h3>
            <p>Estrela district · 3 properties reviewed · July 2026 tour cohort</p>
            <div className="report-tags">
              {["NIF Guide", "CPCV Template", "Yield Calc", "Solicitor Contacts", "Tax Summary"].map((tag) => (
                <span key={tag} className="report-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        {HOW_STEPS.map((step, i) => (
          <Reveal key={step.num} delay={i * 0.08}>
            <div className="how-step">
              <div className="hs-n">{step.num}</div>
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

export function TestimonialsSection() {
  return (
    <section className="test-section" id="testimonials">
      <div className="t-container">
        <div className="section-eyebrow">From Our Travellers</div>
        <h2 className="section-title">Real Investors.<br /><em>Real Results.</em></h2>
        <Reveal>
          <div className="test-grid">
            {TESTIMONIALS.map((test) => (
              <div key={test.initials} className="test-card">
                <div className="tq">"</div>
                <p className="tt">{test.text}</p>
                <div className="ta">
                  <div className={`ta-av ${test.avClass}`}>{test.initials}</div>
                  <div>
                    <div className="ta-name">{test.name}</div>
                    <div className="ta-orig">{test.origin}</div>
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
                toast({ title: "Thank you", description: "You're on the list." });
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