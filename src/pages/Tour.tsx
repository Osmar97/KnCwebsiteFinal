import { useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";

// ── TYPES ──────────────────────────────────────────────────────────────────

interface StatBoxProps {
  num: string;
  label: string;
  variant?: "gold" | "mid" | "dark-gold" | "default";
}
interface DayCardProps {
  dayNumber: string;
  date: string;
  title: string;
  items: string[];
  delayIndex?: number;
}
interface InclusionItemProps {
  icon: string;
  title: string;
  description: string;
  delayIndex?: number;
}
interface TcBlockProps {
  title: string;
  items: string[];
  delayIndex?: number;
}
interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

// ── DATA ───────────────────────────────────────────────────────────────────

const STATS: StatBoxProps[] = [
  { num: "5", label: "Days of Immersion", variant: "default" },
  { num: "6", label: "Spots Available", variant: "gold" },
  { num: "1:1", label: "CONSULTATION", variant: "mid" },
  { num: "∞", label: "Doors Opened", variant: "dark-gold" },
];

const DAYS: DayCardProps[] = [
  {
    dayNumber: "01", date: "Sunday · 6 July", title: "Arrival & Orientation",
    items: ["Welcome reception & group dinner (included meal)", "KnC programme overview & goals session", "Portugal market briefing: current landscape & opportunities", "1:1 personal goals conversation with your consultant", "City orientation & logistics overview"],
  },
  {
    dayNumber: "02", date: "Monday · 7 July", title: "The Legal & Financial Framework",
    items: ["Morning: Property law masterclass with specialist lawyer", "NIF registration, CPCV, and deed process explained", "Tax session with Portuguese accountant (IRS, NHR, IMT)", "Afternoon: Mortgage & financing structures with broker", "Evening: Q&A roundtable — bring every question"],
  },
  {
    dayNumber: "03", date: "Tuesday · 8 July", title: "Property Typology & Analysis",
    items: ["Introduction to Portuguese property types: T0 to T4+, commercial, land", "New build vs. resale vs. renovation — pros & cons", "Investment analysis workshop: yield calculation, cash flow, ROI", "Rental income vs. capital appreciation strategies", "Group deal simulation exercise with real data"],
  },
  {
    dayNumber: "04", date: "Wednesday · 9 July", title: "Live Property Tours",
    items: ["Curated tours across 4–6 pre-selected properties", "Mix of Lisbon neighbourhoods: central, emerging, coastal", "On-site analysis with your consultant — what to look for", "Developer and agent meetings included", "Post-tour debrief: ranking and shortlisting"],
  },
  {
    dayNumber: "05", date: "Thursday · 10 July", title: "Strategy & Next Steps",
    items: ["Personal 1:1 strategy consultation (free, included)", "Custom property roadmap for each participant", "Network introductions: legal, financial, and property contacts", "How to proceed remotely from your home country", "Closing session & group farewell lunch"],
  },
];

const INCLUSIONS: InclusionItemProps[] = [
  { icon: "🏨", title: "4-Night Hotel Stay", description: "Accommodation for the full duration of the programme, centrally located in Lisbon." },
  { icon: "🍽️", title: "One Meal Per Day", description: "A daily group meal included — spanning welcome dinner, working lunches, and farewell lunch." },
  { icon: "🏛️", title: "Lawyer & Accountant Sessions", description: "Direct access to specialist legal and tax professionals briefed on diaspora investor needs." },
  { icon: "🏦", title: "Mortgage Broker Meeting", description: "Private session with a mortgage broker experienced in financing for non-resident buyers." },
  { icon: "🔑", title: "Live Property Tours", description: "Curated visits to 4–6 real properties across different Lisbon neighbourhoods and price points." },
  { icon: "📊", title: "Investment Analysis Workshop", description: "Hands-on session to analyse real deals, calculate yields, and understand what makes a good investment." },
  { icon: "💬", title: "Free 1:1 Consultation", description: "A private strategy session with your Kings 'n Company consultant — included, no upsell." },
  { icon: "📁", title: "KnC Resource Pack", description: "Digital materials: property checklists, investment templates, key contacts, and your personal roadmap." },
];

const PRICING_FEATURES: { text: string; highlight?: boolean }[] = [
  { text: "4-night hotel accommodation in central Lisbon", highlight: true },
  { text: "One group meal per day throughout the programme" },
  { text: "Lawyer, accountant & mortgage broker sessions" },
  { text: "Live property tours across Lisbon" },
  { text: "Property typology & investment analysis workshop" },
  { text: "Free 1:1 personal strategy consultation", highlight: true },
  { text: "KnC resource pack & personal property roadmap" },
  { text: "Kings 'n Company aftercare & continued support" },
];

const TC_BLOCKS: TcBlockProps[] = [
  {
    title: "Booking & Payment",
    items: ["A non-refundable deposit of 1.000€ is required to secure your place. The remaining balance of 2.500€ is due by 1 June 2025.", "Full payment is accepted via bank transfer. Payment details are provided upon booking confirmation.", "Your place is only confirmed upon receipt of the deposit and written confirmation from Kings 'n Company.", "Maximum group size is 6 participants. Places are allocated on a first-paid basis."],
  },
  {
    title: "Cancellation Policy",
    items: ["The 1.000€ deposit is non-refundable under all circumstances.", "Cancellations received before 1 June 2025: balance refunded in full.", "Cancellations received between 1 June and 22 June 2025: 50% of the balance will be refunded.", "Cancellations received after 22 June 2025: no refund. Your place may be transferred to another person — notify us in writing at least 5 days prior.", "Kings 'n Company reserves the right to cancel the tour if fewer than 3 participants are confirmed by 1 June 2025, in which case all payments including the deposit will be refunded in full."],
  },
  {
    title: "Programme & Inclusions",
    items: ["The programme itinerary is subject to change. Kings 'n Company reserves the right to adjust session content, property visit schedules, or professional speakers while maintaining the overall value and objectives of the tour.", "Hotel accommodation is provided for 4 nights (6–9 July). Check-out is on 10 July. Participants are responsible for arranging their own travel to and from Lisbon.", "One meal per day is included as part of the group programme. Additional meals, drinks, and personal expenses are not covered.", "The free 1:1 consultation is a strategic guidance session. It does not constitute legal, financial, tax, or investment advice.", "Professional sessions (lawyer, accountant, mortgage broker) are educational in nature. They do not form a client–professional relationship unless separately contracted by the participant."],
  },
  {
    title: "Liability & Conduct",
    items: ["Kings 'n Company accepts no responsibility for any loss, injury, property damage, or travel disruption arising before, during, or after the programme. Participants are strongly advised to obtain comprehensive travel insurance.", "Property tours are conducted with the cooperation of third-party agents and developers. Kings 'n Company does not guarantee the availability of specific properties.", "Kings 'n Company does not act as a buyer's agent or legal representative during the tour. Any property transactions entered into are the sole decision and responsibility of the participant.", "Kings 'n Company reserves the right to remove any participant from the programme for disruptive or inappropriate conduct without refund.", "By participating, you consent to photography and video recording during the programme for use in Kings 'n Company marketing materials. Opt-out requests must be submitted in writing before the programme begins."],
  },
];

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function LanguageSwitcher({ current, onChange }: { current: Language, onChange: (l: Language) => void }) {
  const langs: { key: Language; label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'pt', label: 'PT' },
    { key: 'fr', label: 'FR' }
  ];
  return (
    <div className="lang-switcher">
      {langs.map((l) => (
        <button
          key={l.key}
          className={`lang-btn ${current === l.key ? 'active' : ''}`}
          onClick={() => onChange(l.key)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function Reveal({ children, className = "", style = {}, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}s`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
}

function StatBox({ num, label, variant = "default" }: StatBoxProps) {
  const bg: Record<string, string> = {
    default: "var(--dark)", gold: "var(--gold)", mid: "var(--mid)", "dark-gold": "var(--gold-dark)",
  };
  return (
    <div style={{ background: bg[variant], padding: "32px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: -10, width: 60, height: 60, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: "var(--white)", lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 10 }}>{label}</div>
    </div>
  );
}

function DayCard({ dayNumber, date, title, items, delayIndex = 0 }: DayCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delayIndex * 0.1}s`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delayIndex]);

  return (
    <div
      ref={ref}
      className="reveal day-card"
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(133,117,78,0.09)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
    >
      <div className="day-card-number">{dayNumber}</div>
      <div className="day-card-date">{date}</div>
      <div className="day-card-title">{title}</div>
      <div className="day-card-divider" />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} className="day-card-item">
            <span className="day-card-bullet" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InclusionItem({ icon, title, description, delayIndex = 0 }: InclusionItemProps) {
  return (
    <Reveal delay={delayIndex * 0.08} className="inclusion-item">
      <div className="inclusion-icon">{icon}</div>
      <div>
        <h4 className="inclusion-title">{title}</h4>
        <p className="inclusion-desc">{description}</p>
      </div>
    </Reveal>
  );
}

function TcBlock({ title, items, delayIndex = 0 }: TcBlockProps) {
  return (
    <Reveal delay={delayIndex * 0.1}>
      <h3 className="tc-block-title">{title}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} className="tc-block-item">
            <span className="tc-bullet" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const t = (path: string) => {
    const keys = path.split('.');
    let obj: any = TRANSLATIONS[lang];
    for (const key of keys) {
      obj = obj?.[key];
    }
    return obj || path;
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const { data, error } = await supabase.functions.invoke("create-stripe-checkout", {
        body: { origin: window.location.origin },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was a problem initiating your checkout. Please try again or contact us.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const EMAIL_PRIVATE = "mailto:hello@kingsncompany.com?subject=Private%20Property%20Tour%20Enquiry";
  const EMAIL_CONTACT = "mailto:hello@kingsncompany.com";

  return (
    <div className="tour-page">

      {/* ── BACK BUTTON ── */}
      <div style={{ position: "fixed", top: 24, left: 24, zIndex: 100, display: "flex", gap: 12 }}>
        <button className="back-btn" onClick={() => navigate("/services")} title={t('back')}>
          <ArrowLeft size={18} />
          <span>{t('back')}</span>
        </button>
      </div>

      <LanguageSwitcher current={lang} onChange={setLang} />

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-pattern" />
        <div className="hero-content">
          <p className="hero-label">{t('hero.label')}</p>
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            <p className="eyebrow-text">{t('hero.eyebrow')}</p>
            <span className="eyebrow-line" />
          </div>
          <h1 className="hero-h1">
            {t('hero.h1_1')} <em>{t('hero.h1_2')}</em><br />{t('hero.h1_3')}
          </h1>
          <p className="hero-date">{t('hero.date')}</p>
          <div className="hero-ctas">
            <button onClick={handleCheckout} disabled={isCheckingOut} className="btn-primary">
              {isCheckingOut && <Loader2 size={14} className="animate-spin" />}
              {isCheckingOut ? "Processing..." : t('hero.cta_reserve')}
            </button>
            <a href="#private" className="btn-outline">{t('hero.cta_private')}</a>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-label">{t('hero.scroll')}</span>
        </div>
      </section>

      {/* ── INTRO BAND ── */}
      <div className="intro-band">
        <p className="intro-band-text">{t('intro')}</p>
      </div>

      {/* ── ABOUT ── */}
      <section className="about-section">
        <div className="container-wide grid-2col">
          <Reveal>
            <p className="section-label">{t('about.label')}</p>
            <h2 className="section-heading">
              {t('about.heading_1')}<em>{t('about.heading_2')}</em>{t('about.heading_3')}
            </h2>
            <p className="body-text" style={{ marginBottom: 16 }}>{t('about.body_1')}</p>
            <p className="body-text">{t('about.body_2')}</p>
            <div className="stats-grid">
              {(t('about.stats') as any[]).map((s) => <StatBox key={s.label} {...s} />)}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="section-label">{t('about.who_label')}</p>
            <h3 className="subheading">
              {t('about.who_heading_1')}<em>{t('about.who_heading_2')}</em>
            </h3>
            <p className="body-text" style={{ marginBottom: 20 }}>{t('about.who_body')}</p>
            <div className="audience-list">
              {(t('about.audience') as string[]).map((item, i) => (
                <div key={i} className="audience-item">
                  <Check size={14} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <blockquote className="founder-quote">
              <p>"{t('about.quote')}"</p>
              <cite>{t('about.founder')}</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── ITINERARY ── */}
      <section className="itinerary-section">
        <div className="container-wide">
          <Reveal className="section-header-center">
            <p className="section-label light">{t('itinerary.label')}</p>
            <h2 className="section-heading light">
              {t('itinerary.heading_1')}<em>{t('itinerary.heading_2')}</em>
            </h2>
            <p className="section-subtitle">{t('itinerary.subtitle')}</p>
          </Reveal>
          <div className="days-grid">
            {(t('itinerary.days') as any[]).map((day, i) => (
              <DayCard
                key={day.day}
                dayNumber={day.day}
                date={day.date}
                title={day.title}
                items={day.items}
                delayIndex={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS ── */}
      <section className="inclusions-section">
        <div className="container-wide">
          <Reveal className="section-header-center">
            <p className="section-label">{t('inclusions.label')}</p>
            <h2 className="section-heading">
              {t('inclusions.heading_1')}<em>{t('inclusions.heading_2')}</em>
            </h2>
          </Reveal>
          <div className="inclusions-grid">
            {(t('inclusions.items') as any[]).map((item, i) => <InclusionItem key={item.title} {...item} delayIndex={i % 4} />)}
          </div>
          <Reveal className="not-included-box">
            <div style={{ fontSize: 22 }}>ℹ️</div>
            <div>
              <p className="not-included-title">{t('inclusions.not_included.title')}</p>
              <p className="not-included-text">{t('inclusions.not_included.text')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="pricing-section">
        <div className="container-narrow">
          <Reveal className="section-header-center">
            <p className="section-label">{t('pricing.label')}</p>
            <h2 className="section-heading">
              {t('pricing.heading_1')}<em>{t('pricing.heading_2')}</em>
            </h2>
            <p className="body-text" style={{ textAlign: "center" }}>{t('pricing.body')}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="pricing-card">
              <div className="pricing-card-glow" />
              <div className="pricing-badge">{t('pricing.badge')}</div>
              <p className="pricing-tier">{t('pricing.tier')}</p>
              <div className="pricing-amount">
                <span className="pricing-number">{t('pricing.amount')}</span>
                <span className="pricing-currency">{t('pricing.currency')}</span>
              </div>
              <p className="pricing-note">{t('pricing.note')}</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {(t('pricing.features') as any[]).map((f, i) => (
                  <li key={i} className={`pricing-feature-item ${f.highlight ? "highlight" : ""}`}>
                    <Check size={14} style={{ color: "var(--gold)", flexShrink: 0 }} />
                    {f.text}
                  </li>
                ))}
              </ul>
              <button onClick={handleCheckout} disabled={isCheckingOut} className="btn-primary btn-full">
                {isCheckingOut && <Loader2 size={14} className="animate-spin" />}
                {isCheckingOut ? "Processing..." : t('pricing.cta')}
              </button>
              <p className="pricing-deposit-note">{t('pricing.deposit_note')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRIVATE TOUR ── */}
      <section id="private" className="private-section">
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <Reveal>
            <p className="section-label" style={{ color: "rgba(255,255,255,0.5)" }}>{t('private.label')}</p>
            <h2 className="section-heading light">
              {t('private.heading_1')}<em>{t('private.heading_2')}</em>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8, fontFamily: "'Montserrat', sans-serif" }}>
              {t('private.body')}
            </p>
            <a href={EMAIL_PRIVATE} className="btn-white">{t('private.cta')}</a>
          </Reveal>
        </div>
      </section>

      {/* ── T&C ── */}
      <section className="tc-section">
        <div className="container-wide">
          <Reveal style={{ maxWidth: 560 }}>
            <p className="section-label">{t('tc.label')}</p>
            <h2 className="section-heading">
              {t('tc.heading_1')}<em>{t('tc.heading_2')}</em>
            </h2>
            <p className="body-text">{t('tc.body')}</p>
          </Reveal>
          <div className="tc-grid">
            {(t('tc.blocks') as any[]).map((block, i) => (
              <Reveal key={block.title} delay={i * 0.1}>
                <h3 className="tc-block-title">{block.title}</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {block.items.map((item: string, j: number) => (
                    <li key={j} className="tc-block-item">
                      <span className="tc-bullet" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="tc-contact-box">
            <p className="tc-contact-text">
              {t('tc.contact')}
              <a href={EMAIL_CONTACT} className="tc-link">hello@kingsncompany.com</a>{" "}
              {t('tc.contact_cta')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tour-footer">
        <div className="footer-logo">Kings 'n Company</div>
        <div className="footer-tagline">{t('footer.tagline')}</div>
        <nav className="footer-nav">
          {[
            { label: (t('footer.links') as string[])[0], href: "#pricing" },
            { label: (t('footer.links') as string[])[1], href: "#private" },
            { label: (t('footer.links') as string[])[2], href: EMAIL_CONTACT }
          ].map(({ label, href }) => (
            <a key={label} href={href} className="footer-link">{label}</a>
          ))}
        </nav>
        <p className="footer-copy">
          {t('footer.copy')}
        </p>
      </footer>
    </div>
  );
}
