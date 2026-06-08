import { useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";
import PreTourFormModal, { PreTourFormData } from "@/components/tour/PreTourFormModal";
import InlineTourForm from "@/components/tour/InlineTourForm";
import TourDetailModal from "@/components/tour/TourDetailModal";
import { useTours, pickLocalized, nextTourDate, formatTourDateRange, type TourRow } from "@/hooks/useTours";

// ── STATIC DATA ─────────────────────────────────────────────────────────────

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

function tourCategoryFilter(t: TourRow): "portugal" | "cabo-verde" | "combined" {
  const flag = t.flag || "";
  if (flag === "🇵🇹") return "portugal";
  if (flag === "🇨🇻") return "cabo-verde";
  return "combined";
}

interface GroupTourData {
  num: string;
  theme: string;
  name: string;
  dest: string;
  tags: string[];
  waitlistPct: number;
  waitlistLabel: string;
  price: string;
}

const GROUP_TOURS: GroupTourData[] = [
  {
    num: "01", theme: "Coastal Lifestyle",
    name: "The Sun & Yield Tour",
    dest: "Algarve, Portugal · 5 Days",
    tags: ["Pool Views", "Rental Yield", "Beach Access"],
    waitlistPct: 78,
    waitlistLabel: "7/9 spots filled",
    price: "850€",
  },
  {
    num: "02", theme: "Capital Growth",
    name: "The Lisbon Ascent",
    dest: "Lisbon, Portugal · 5 Days",
    tags: ["Emerging Hoods", "Long-Term Holds", "Legal Day"],
    waitlistPct: 56,
    waitlistLabel: "5/9 spots filled",
    price: "790€",
  },
  {
    num: "03", theme: "First-Time Buyer",
    name: "The Entry Point",
    dest: "Porto, Portugal · 3 Days",
    tags: ["Under €200K", "Beginner-Friendly", "High ROI"],
    waitlistPct: 44,
    waitlistLabel: "4/9 spots filled",
    price: "590€",
  },
  {
    num: "04", theme: "Diaspora Pioneer",
    name: "The Cabo Verde Opener",
    dest: "Praia + Mindelo, Cabo Verde · 5 Days",
    tags: ["Pre-Market", "Diaspora Focus", "Cultural Immersion"],
    waitlistPct: 33,
    waitlistLabel: "3/9 spots filled",
    price: "690€",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Apply for Your Tour",
    body: "Submit your budget, target market, and buying timeline. We confirm your tour date and match you with the right property shortlist within 48 hours.",
  },
  {
    num: "02",
    title: "Pre-Tour Briefing",
    body: "One week before departure, we hold a 60-minute video call covering your shortlist, tax implications, visa options, and what to bring to property viewings.",
  },
  {
    num: "03",
    title: "The Tour — On the Ground",
    body: "Curated property viewings, neighbourhood walks, legal and financial briefings, and one cultural experience that helps you understand where you're investing.",
  },
  {
    num: "04",
    title: "Solicitor Day",
    body: "A dedicated session with a bilingual solicitor and, if needed, a mortgage broker. Walk through the legal structure and ask every question you have.",
  },
  {
    num: "05",
    title: "Post-Tour Report & Follow-Up",
    body: "Within 5 days of your tour, you receive a written report: property shortlist, solicitor notes, tax overview, and your recommended next steps.",
  },
];

const TESTIMONIALS = [
  {
    initials: "MJ", avClass: "av1",
    text: "I came on the Lisbon tour in March not sure if I was ready. By day 3 I had a solicitor and a property I loved. I signed the CPCV six weeks later. Kings 'n Company made it real.",
    name: "Marcus J.",
    origin: "Atlanta, GA · Lisbon Property Owner",
  },
  {
    initials: "AF", avClass: "av2",
    text: "The dual-market tour changed how I see my money. I bought in Praia and I'm now under offer in Porto. Ismael and the team know every corner of both markets and it shows.",
    name: "Amina F.",
    origin: "London, UK · Porto & Praia Investor",
  },
  {
    initials: "DS", avClass: "av3",
    text: "As a first-time buyer abroad the legal side terrified me. Having the solicitor day built into the tour and getting that written report after made me feel protected the whole way through.",
    name: "David S.",
    origin: "Toronto, CA · Algarve Property Owner",
  },
];

const DESTINATIONS = [
  { bgClass: "db-lisbon", country: "Portugal", name: "Lisbon", detail: "Estrela · Mouraria · Alcântara · Marvila · Belém" },
  { bgClass: "db-porto", country: "Portugal", name: "Porto", detail: "Bonfim · Paranhos · Cedofeita" },
  { bgClass: "db-algarve", country: "Portugal", name: "Algarve", detail: "Lagos · Portimão · Silves · Tavira" },
  { bgClass: "db-cv", country: "Cabo Verde", name: "Santiago + Sal", detail: "Praia · Mindelo · Sal Island" },
];

// ── UTILITY COMPONENTS ───────────────────────────────────────────────────────

function LanguageSwitcher({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
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

function Reveal({ children, className = "", style = {}, delay = 0 }: { children: ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
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

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [showPreForm, setShowPreForm] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [privateSubmitted, setPrivateSubmitted] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isSubmittingPrivate, setIsSubmittingPrivate] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourRow | null>(null);
  const { tours, availability, loading: toursLoading } = useTours();

  const t = (path: string) => {
    const keys = path.split(".");
    let obj: any = TRANSLATIONS[lang];
    for (const key of keys) obj = obj?.[key];
    return obj || path;
  };

  const handleCheckout = async (preTourData?: PreTourFormData) => {
    try {
      setIsCheckingOut(true);
      const { data, error } = await supabase.functions.invoke("create-stripe-checkout", {
        body: { origin: window.location.origin, preTourData },
      });
      if (error) throw error;
      if (data?.url) {
        setShowPreForm(false);
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({ title: "Checkout failed", description: "There was a problem initiating your checkout. Please try again or contact us.", variant: "destructive" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleEnquiry = async (data: PreTourFormData) => {
    try {
      setIsSendingEnquiry(true);
      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: data });
      if (error) throw error;
      setShowEnquiryForm(false);
      toast({ title: "Request sent", description: "Thank you — we'll be in touch shortly to arrange your private tour." });
    } catch (error) {
      console.error("Enquiry error:", error);
      toast({ title: "Something went wrong", description: "We couldn't send your request. Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSendingEnquiry(false);
    }
  };

  const submitInlineForm = async (
    payload: Record<string, unknown>,
    setLoading: (b: boolean) => void,
    setSubmitted: (b: boolean) => void,
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: payload });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Request received", description: "Thank you — we'll be in touch shortly." });
    } catch (err) {
      console.error("Inline form error:", err);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openReserveForm = () => setShowPreForm(true);
  const openEnquiryForm = () => setShowEnquiryForm(true);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredTours = activeTab === "all"
    ? tours
    : tours.filter((c) => tourCategoryFilter(c) === activeTab);

  const EMAIL_CONTACT = "mailto:services@kingsncompany.com";

  return (
    <div className="tour-page">

      {/* ── TOP NAV ── */}
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
          <button className="tnav-cta" onClick={openReserveForm} disabled={isCheckingOut}>
            {t("nav.cta")}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-grain" />
        <div className="hero-radial" />
        <div className="hero-content">
          <div className="hero-eyebrow">Kings 'n Company — Property Ownership Tours</div>
          <h1 className="hero-h1">
            See it.<br />
            <em>Understand it.</em><br />
            Own it.
          </h1>
          <p className="hero-sub">
            Curated property exploration experiences across Portugal and Cabo Verde. For the diaspora investor who wants to walk the ground before signing the contract.
          </p>
          <div className="hero-ctas">
            <button onClick={openReserveForm} disabled={isCheckingOut} className="btn-primary">
              {isCheckingOut && <Loader2 size={14} className="animate-spin" />}
              {isCheckingOut ? "Processing..." : "Book Private Tour"}
            </button>
            <a href="#group" className="btn-outline">Join a Group Tour</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="h-stat"><span className="h-stat-n">10</span><span className="h-stat-l">Destinations</span></div>
          <div className="h-stat"><span className="h-stat-n">10</span><span className="h-stat-l">Group Themes</span></div>
          <div className="h-stat"><span className="h-stat-n">1–10</span><span className="h-stat-l">Days, Private</span></div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="sb"><div className="sb-n">47+</div><div className="sb-l">Investors Hosted</div></div>
        <div className="sb"><div className="sb-n">2</div><div className="sb-l">Countries</div></div>
        <div className="sb"><div className="sb-n">€260K</div><div className="sb-l">Avg Deal Size</div></div>
        <div className="sb"><div className="sb-n">100%</div><div className="sb-l">Guided End-to-End</div></div>
      </div>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="includes-section">
        <div className="t-container">
          <div className="section-eyebrow">Every Tour</div>
          <h2 className="section-title">What comes<br /><em>standard</em></h2>
          <Reveal>
            <div className="includes-grid">
              {[
                { icon: "🛎", title: "Hotel Included", desc: "3-star accommodation, upgraded tiers available. Negotiated group rates ensure quality without overpaying." },
                { icon: "🚐", title: "Private Transport", desc: "Dedicated driver between all property visits, neighbourhoods, and activities. No taxis, no confusion." },
                { icon: "☀️", title: "Breakfast + Lunch", desc: "Breakfast at the hotel, lunch at a curated local restaurant chosen for the day's area and energy." },
                { icon: "📋", title: "Consultation & Debrief", desc: "A call before you arrive, and a structured final session before you leave. You come with questions. You leave with a plan." },
                { icon: "🏛", title: "Airport Transfers", desc: "Pickup and drop-off included for private tours. Group tours include an optional shared shuttle." },
                { icon: "🎭", title: "One Curated Activity", desc: "A boat tour, cultural workshop, or community event matched to your group's vibe. Context matters." },
              ].map((item) => (
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

      {/* ── TWO WAYS TO EXPLORE ── */}
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
                <div className="format-price">From €350 / day per person</div>
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
                <div className="format-price">From €790 / person</div>
                <div className="format-arrow">→</div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED TOURS ── */}
      <section className="tours-section" id="tours">
        <div className="t-container">
          <div className="tours-header">
            <div>
              <div className="section-eyebrow">{t("tours_section.eyebrow")}</div>
              <h2 className="section-title">{t("tours_section.title_1")}<br /><em>{t("tours_section.title_2")}</em></h2>
            </div>
            <a href="#group" className="see-all">{t("tours_section.view_all")}</a>
          </div>
          <div className="tour-tabs">
            {[
              { key: "all", label: "All Tours" },
              { key: "portugal", label: "Portugal" },
              { key: "cabo-verde", label: "Cabo Verde" },
              { key: "combined", label: "Combined" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`ttab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tours-grid">
            {toursLoading && <p style={{ opacity: 0.6 }}>Loading tours…</p>}
            {!toursLoading && filteredTours.length === 0 && (
              <p style={{ opacity: 0.6 }}>No tours available right now. Check back soon.</p>
            )}
            {filteredTours.map((card, i) => {
              const next = nextTourDate(card.dates);
              const avail = next ? availability[next.id] : undefined;
              const remaining = avail?.remaining ?? next?.capacity ?? 0;
              const cap = avail?.capacity ?? next?.capacity ?? 0;
              const spotsText = !next ? "Coming soon"
                : next.sold_out ? "Sold out"
                : remaining <= 3 ? `${remaining} spots left`
                : `${remaining} spots`;
              const spotsFew = next ? (next.sold_out || remaining <= 3) : false;
              const symbol = CURRENCY_SYMBOL[card.currency] || card.currency;
              const price = `${symbol}${Number(card.base_price).toLocaleString()}`;
              const dateLabel = next ? formatTourDateRange(next, lang === "en" ? "en-GB" : lang === "pt" ? "pt-PT" : "fr-FR") : "TBA";
              const cardRec = card as unknown as Record<string, unknown>;
              const name = pickLocalized(cardRec, "name", lang);
              const shortDesc = pickLocalized(cardRec, "short_desc", lang);
              const openModal = () => setSelectedTour(card);
              return (
                <Reveal key={card.id} delay={i * 0.05}>
                  <div className="tour-card" onClick={openModal} role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openModal()}>
                    <div className="tour-img">
                      <div className={`tour-img-inner ${card.hero_image || ""}`} />
                      {card.badge && <div className={`tour-badge ${card.badge_variant === "gold" ? "gold" : ""}`}>{card.badge}</div>}
                      {card.flag && <div className="tour-flag">{card.flag}</div>}
                      <div className={`tour-spots ${spotsFew ? "few" : ""}`}>{spotsText}</div>
                    </div>
                    <div className="tour-body">
                      <div className="tour-loc">{card.destinations.slice(0, 2).join(" · ")}</div>
                      <div className="tour-title">{name}</div>
                      <p className="tour-desc">{shortDesc}</p>
                      <div className="tour-meta">
                        <span className="tour-pill">{card.duration_days} Days</span>
                        {cap > 0 && <span className="tour-pill">{cap} Participants</span>}
                        {card.tags[0] && <span className="tour-pill">{card.tags[0]}</span>}
                      </div>
                      <div className="tour-footer">
                        <div className="tour-price">
                          <strong>{price}</strong>
                          per person
                        </div>
                        <div className="tour-date">
                          {dateLabel}
                          <span>NEXT</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="tour-request-custom"
                        onClick={(e) => { e.stopPropagation(); scrollToId("private"); }}
                      >
                        {t("tours_section.request_custom")}
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="dest-section" id="destinations">
        <div className="t-container">
          <div className="section-eyebrow">Where We Go</div>
          <h2 className="section-title">Two countries.<br /><em>Endless opportunity.</em></h2>
          <Reveal>
            <div className="dest-grid">
              {DESTINATIONS.map((d) => (
                <div key={d.name} className="dest-card">
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

      {/* ── HOW IT WORKS ── */}
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
                {["NIF Guide", "CPCV Template", "Yield Calc", "Solicitor Contacts", "Tax Summary"].map((t) => (
                  <span key={t} className="report-tag">{t}</span>
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

      {/* ── GROUP TOURS ── */}
      <section className="group-section" id="group">
        <div className="t-container">
          <div className="section-eyebrow">Group Tours</div>
          <h2 className="section-title">Ten themed<br /><em>journeys</em></h2>
          <p className="section-desc">
            Join a curated group of 5–9 investors. We launch the trip when the group fills. Join the waitlist, attend your individual pre-trip call, and arrive ready to decide.
          </p>
          <Reveal>
            <div className="group-grid">
              {GROUP_TOURS.map((tour) => (
                <div key={tour.num} className="group-card">
                  <div className="gc-num">{tour.num}</div>
                  <span className="gc-theme">{tour.theme}</span>
                  <div className="gc-name">{tour.name}</div>
                  <div className="gc-dest">{tour.dest}</div>
                  <div className="gc-tags">
                    {tour.tags.map((tag) => <span key={tag} className="gc-tag">{tag}</span>)}
                  </div>
                  <div className="wl-bar">
                    <div className="wl-fill" style={{ width: `${tour.waitlistPct}%` }} />
                  </div>
                  <p className="wl-label"><strong>{tour.waitlistLabel}</strong> — join the waitlist to lock your spot</p>
                  <div className="gc-footer">
                    <div className="gc-price">{tour.price} <span>/ person</span></div>
                    <button className="btn-gold-outline" onClick={openEnquiryForm}>Join Waitlist</button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
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

      {/* ── PRIVATE TOUR ── */}
      <section className="form-section" id="private">
        <div className="t-container">
          <div className="section-eyebrow">Private Tour</div>
          <h2 className="section-title">Design your<br /><em>experience</em></h2>
          <p className="section-desc">
            Tell us what you're looking for. We'll review your submission and send a tailored quote within 48 hours, along with availability for your first consultation call.
          </p>
          <Reveal>
            <InlineTourForm
              variant="private"
              isSubmitting={isSubmittingPrivate}
              submitted={privateSubmitted}
              onSubmit={(payload) => submitInlineForm(payload, setIsSubmittingPrivate, setPrivateSubmitted)}
            />
          </Reveal>
        </div>
      </section>

      {/* ── GROUP WAITLIST FORM ── */}
      <section className="form-section dark" id="waitlist">
        <div className="t-container">
          <div className="section-eyebrow">Join the Waitlist</div>
          <h2 className="section-title">Tell us where<br /><em>you want to go</em></h2>
          <p className="section-desc">
            Whether you're joining a group trip or considering a private tour, this form gives us everything we need to find the right experience for you. We'll be in touch within 5 business days.
          </p>
          <Reveal>
            <InlineTourForm
              variant="waitlist"
              isSubmitting={isSubmittingWaitlist}
              submitted={waitlistSubmitted}
              onSubmit={(payload) => submitInlineForm(payload, setIsSubmittingWaitlist, setWaitlistSubmitted)}
            />
          </Reveal>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
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

      {/* ── FOOTER ── */}
      <footer className="page-footer">
        <div className="footer-top">
          <div>
            <div className="f-logo">
              <div className="f-logo-mark">KnC</div>
              <div className="f-logo-text">
                Kings 'n Company
                <span>Property Ownership Tours</span>
              </div>
            </div>
            <p className="f-tag">"We guide you home."</p>
            <div className="f-contact">
              <a href={EMAIL_CONTACT}>services@kingsncompany.com</a>
              <a href="https://www.kingsncompany.com">www.kingsncompany.com</a>
            </div>
          </div>
          <div className="f-col">
            <h4>Tours</h4>
            <ul>
              <li><a href="#overview">Private Tours</a></li>
              <li><a href="#group">Group Tours</a></li>
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#tours">Upcoming Dates</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Countries</h4>
            <ul>
              <li><a href="#destinations">Portugal</a></li>
              <li><a href="#destinations">Cabo Verde</a></li>
              <li><a href="#destinations">Lisbon</a></li>
              <li><a href="#destinations">Algarve</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About KnC</a></li>
              <li><a href="/services">All Services</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <p>{t("footer.copy")}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Portugal · Cabo Verde</p>
        </div>
      </footer>

      {/* ── MODALS ── */}
      <PreTourFormModal
        open={showPreForm}
        onOpenChange={setShowPreForm}
        onSubmit={(data) => handleCheckout(data)}
        isSubmitting={isCheckingOut}
      />
      <PreTourFormModal
        open={showEnquiryForm}
        onOpenChange={setShowEnquiryForm}
        onSubmit={(data) => handleEnquiry(data)}
        isSubmitting={isSendingEnquiry}
        mode="enquiry"
      />
      <TourDetailModal
        tour={selectedTour}
        availability={availability}
        lang={lang}
        open={selectedTour !== null}
        onOpenChange={(o) => { if (!o) setSelectedTour(null); }}
        onJoinWaitlist={() => {
          setSelectedTour(null);
          setTimeout(() => scrollToId("waitlist"), 80);
        }}
        labels={{
          destinations: t("tour_modal.destinations"),
          nextDate: t("tour_modal.next_date"),
          spotsFilled: (f, total) => String(t("tour_modal.spots_filled")).replace("{filled}", String(f)).replace("{total}", String(total)),
          remaining: (n) => String(t("tour_modal.remaining")).replace("{n}", String(n)),
          from: t("tour_modal.from"),
          perPerson: "per person",
          joinWaitlist: t("tour_modal.join_waitlist"),
          close: t("tour_modal.close"),
          soldOut: t("tour_modal.sold_out"),
        }}
      />
    </div>
  );
}
