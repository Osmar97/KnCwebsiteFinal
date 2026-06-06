import { useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";
import PreTourFormModal, { PreTourFormData } from "@/components/tour/PreTourFormModal";

// ── STATIC DATA ─────────────────────────────────────────────────────────────

interface TourCardData {
  id: string;
  category: "portugal" | "cabo-verde" | "combined";
  imgClass: string;
  badge?: string;
  badgeGold?: boolean;
  flag: string;
  spotsText: string;
  spotsFew?: boolean;
  location: string;
  title: string;
  desc: string;
  pills: string[];
  price: string;
  date: string;
  dateNote: string;
}

const TOUR_CARDS: TourCardData[] = [
  {
    id: "lisbon-core",
    category: "portugal",
    imgClass: "ti-lisbon",
    badge: "GROUP",
    flag: "🇵🇹",
    spotsText: "4 spots left",
    spotsFew: true,
    location: "Portugal · Lisbon",
    title: "The Lisbon Core",
    desc: "Five days across Estrela, Mouraria, Alcântara and Marvila. Solicitor day included.",
    pills: ["5 Days", "6–9 Participants", "Solicitor Day"],
    price: "€790",
    date: "12–16 Sept",
    dateNote: "per person",
  },
  {
    id: "porto-rise",
    category: "portugal",
    imgClass: "ti-porto",
    badge: "GROUP",
    flag: "🇵🇹",
    spotsText: "6 spots",
    location: "Portugal · Porto",
    title: "The Porto Rise",
    desc: "Bonfim, Paranhos, Cedofeita — Porto's emerging neighbourhoods before they peak.",
    pills: ["3 Days", "5–9 Participants", "Investor Breakfast"],
    price: "€590",
    date: "10–12 Oct",
    dateNote: "per person",
  },
  {
    id: "algarve-coast",
    category: "portugal",
    imgClass: "ti-algarve",
    badge: "FEATURED",
    badgeGold: true,
    flag: "🇵🇹",
    spotsText: "2 spots left",
    spotsFew: true,
    location: "Portugal · Algarve",
    title: "The Algarve Coast",
    desc: "Lagos, Portimão, Silves and Tavira. Sun, yield, and long-term appreciation.",
    pills: ["5 Days", "Pool & Sea Views", "Rental Yield Focus"],
    price: "€850",
    date: "3–7 Nov",
    dateNote: "per person",
  },
  {
    id: "praia-ground",
    category: "cabo-verde",
    imgClass: "ti-praia",
    badge: "GROUP",
    flag: "🇨🇻",
    spotsText: "7 spots",
    location: "Cabo Verde · Praia",
    title: "Praia Ground Zero",
    desc: "Santiago Island's capital. Understand the emerging market before the wave arrives.",
    pills: ["3 Days", "Pre-Market Focus", "Local Contacts"],
    price: "€690",
    date: "18–20 Oct",
    dateNote: "per person",
  },
  {
    id: "mindelo-culture",
    category: "cabo-verde",
    imgClass: "ti-mindelo",
    badge: "GROUP",
    flag: "🇨🇻",
    spotsText: "5 spots",
    location: "Cabo Verde · São Vicente",
    title: "Mindelo & The Culture",
    desc: "São Vicente's creative capital. Boutique buys, arts district, and the hospitality market.",
    pills: ["3 Days", "Culture Focus", "Boutique Buys"],
    price: "€690",
    date: "22–24 Nov",
    dateNote: "per person",
  },
  {
    id: "dual-market",
    category: "combined",
    imgClass: "ti-combined",
    badge: "EXCLUSIVE",
    badgeGold: true,
    flag: "🌍",
    spotsText: "3 spots left",
    spotsFew: true,
    location: "Portugal + Cabo Verde",
    title: "The Dual Market",
    desc: "Lisbon then Praia. Two markets, two strategies, one transformative trip.",
    pills: ["10 Days", "Max 4 Participants", "Both Countries"],
    price: "€2,100",
    date: "Oct–Nov",
    dateNote: "per person",
  },
];

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

  const openReserveForm = () => setShowPreForm(true);
  const openEnquiryForm = () => setShowEnquiryForm(true);

  const filteredTours = activeTab === "all"
    ? TOUR_CARDS
    : TOUR_CARDS.filter((c) => c.category === activeTab);

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
              <div className="section-eyebrow">Upcoming Tours</div>
              <h2 className="section-title">Choose Your<br /><em>Ownership Journey</em></h2>
            </div>
            <a href="#group" className="see-all">View All Dates →</a>
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
            {filteredTours.map((card, i) => (
              <Reveal key={card.id} delay={i * 0.05}>
                <div className="tour-card" onClick={openEnquiryForm} role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openEnquiryForm()}>
                  <div className="tour-img">
                    <div className={`tour-img-inner ${card.imgClass}`} />
                    {card.badge && <div className={`tour-badge ${card.badgeGold ? "gold" : ""}`}>{card.badge}</div>}
                    <div className="tour-flag">{card.flag}</div>
                    <div className={`tour-spots ${card.spotsFew ? "few" : ""}`}>{card.spotsText}</div>
                  </div>
                  <div className="tour-body">
                    <div className="tour-loc">{card.location}</div>
                    <div className="tour-title">{card.title}</div>
                    <p className="tour-desc">{card.desc}</p>
                    <div className="tour-meta">
                      {card.pills.map((p) => <span key={p} className="tour-pill">{p}</span>)}
                    </div>
                    <div className="tour-footer">
                      <div className="tour-price">
                        <strong>{card.price}</strong>
                        {card.dateNote}
                      </div>
                      <div className="tour-date">
                        {card.date}
                        <span>{card.dateNote}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
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
      <section className="private-section" id="private">
        <div className="t-container">
          <Reveal>
            <div className="private-inner">
              <div className="private-text">
                <div className="section-eyebrow light">{t("private.label")}</div>
                <h2 className="section-title light">
                  {t("private.heading_1")}<em>{t("private.heading_2")}</em>
                </h2>
                <p>{t("private.body")}</p>
                <button onClick={openEnquiryForm} disabled={isSendingEnquiry} className="btn-primary">
                  {isSendingEnquiry && <Loader2 size={14} className="animate-spin" />}
                  {t("private.cta")}
                </button>
              </div>
              <div>
                {[
                  { icon: "🗓", label: "1 to 10 days", sub: "Your schedule, your pace" },
                  { icon: "🏡", label: "Portugal or Cabo Verde", sub: "Choose your market" },
                  { icon: "👥", label: "Up to 4 people", sub: "Solo, couple, or small group" },
                  { icon: "⚖️", label: "Lawyer & broker add-ons", sub: "Legal team at your side" },
                ].map((item) => (
                  <div key={item.label} className="how-step" style={{ borderColor: "rgba(133,117,78,0.2)" }}>
                    <div className="hs-n" style={{ fontSize: 28 }}>{item.icon}</div>
                    <div className="hs-b">
                      <h4 style={{ color: "var(--white)", marginTop: 4 }}>{item.label}</h4>
                      <p style={{ color: "rgba(255,255,255,0.4)" }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── T&C ── */}
      <section className="tc-section">
        <div className="t-container">
          <Reveal style={{ maxWidth: 560 }}>
            <div className="section-eyebrow">{t("tc.label")}</div>
            <h2 className="section-title">
              {t("tc.heading_1")}<em>{t("tc.heading_2")}</em>
            </h2>
            <p className="section-desc">{t("tc.body")}</p>
          </Reveal>
          <div className="tc-grid">
            {(t("tc.blocks") as any[]).map((block, i) => (
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
          <Reveal>
            <div className="tc-contact-box">
              <p className="tc-contact-text">
                {t("tc.contact")}
                <a href={EMAIL_CONTACT} className="tc-link">services@kingsncompany.com</a>{" "}
                {t("tc.contact_cta")}
              </p>
            </div>
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
    </div>
  );
}
