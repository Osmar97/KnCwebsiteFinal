import { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Check, Menu, X } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";

// ── TYPES ──────────────────────────────────────────────────────────────────

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

interface GroupTrip {
  id: number;
  theme: string;
  name: string;
  cat: "portugal" | "cabo-verde" | "combined";
  destinations: string;
  tags: string[];
  price: string;
  desc: string;
  spots: number;
  total: number;
  badge: string | null;
  date: string;
  next: string | null;
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const groupTrips: GroupTrip[] = [
  { id: 1, theme: "Urban & Cultural", name: "Cosmopolitan", cat: "portugal", destinations: "Lisbon · Aveiro · Porto", tags: ["3 days", "City", "Investment"], price: "€790", desc: "Three of Portugal's most distinct urban personalities in one journey. Lisbon's mosaic soul, Aveiro's canal quiet, Porto's granite ambition. For the investor who wants density, culture, and long-term value.", spots: 3, total: 9, badge: "Featured", date: "JUL 14–17, 2026", next: "OCT 6–9" },
  { id: 2, theme: "Coastal Living", name: "Beach Lovers", cat: "portugal", destinations: "Cascais · Costa da Caparica · Algarve", tags: ["3 days", "Beach", "Lifestyle"], price: "€790", desc: "Portugal's finest coastline, from the aristocratic calm of Cascais to the raw surf culture of Caparica and the warm light of the Algarve. For the buyer whose heart is near the water.", spots: 6, total: 9, badge: "New Date", date: "AUG 4–7, 2026", next: "NOV 3–6" },
  { id: 3, theme: "Rural & Agricultural", name: "Farm & Nature", cat: "portugal", destinations: "Alentejo · Silver Coast", tags: ["3 days", "Nature", "Lifestyle"], price: "€790", desc: "Cork oak plains, wine country, medieval villages on the coast. For the buyer escaping the city seeking land, silence, and a slower life. Agri-tourism and quinta potential.", spots: 5, total: 9, badge: "Holiday Market", date: "SEP 8–11, 2026", next: "DEC 1–4" },
  { id: 4, theme: "Altitude & Adventure", name: "Mountaineers", cat: "portugal", destinations: "Lisbon · Sintra · Serra da Estrela", tags: ["5 days", "Nature", "Investment"], price: "€1,290", desc: "Begin in Lisbon, ascend to the fairy-tale of Sintra, and reach Portugal's highest peaks. For buyers drawn to dramatic landscapes, off-grid potential, and authentic rural living.", spots: 7, total: 9, badge: null, date: "SEP 22–27, 2026", next: "NOV 17–22" },
  { id: 5, theme: "Capital Deep Dive", name: "Lisbon Insider", cat: "portugal", destinations: "Lisbon — All Neighborhoods", tags: ["3 days", "City", "Investment"], price: "€790", desc: "A systematic walkthrough of every major Lisbon neighborhood: Mouraria, Arroios, Alcântara, Estrela, Marvila, Belém, and beyond. Best for first-time buyers comparing areas.", spots: 2, total: 9, badge: "Best Seller", date: "OCT 13–16, 2026", next: "JAN 12–15 '27" },
  { id: 6, theme: "Diaspora Gateway", name: "West Africa Rising", cat: "cabo-verde", destinations: "Santiago · São Vicente · Sal", tags: ["5 days", "Investment", "Lifestyle"], price: "€1,290", desc: "Cabo Verde through the lens of the diaspora investor. The cultural energy of Mindelo, the economic pace of Praia, the tourism boom of Sal. Three islands, three opportunities.", spots: 5, total: 9, badge: "Hot Market", date: "AUG 4–9, 2026", next: "OCT 20–25" },
  { id: 7, theme: "Island Focus", name: "Praia Ownership", cat: "cabo-verde", destinations: "Praia, Santiago Island", tags: ["5 days", "Beach", "Investment"], price: "€1,200", desc: "Immersive 5-day buying tour in Cabo Verde's capital. Visit new builds, off-plan developments, and meet local solicitors. Ideal for diaspora investors entering West Africa's most stable market.", spots: 2, total: 9, badge: null, date: "AUG 4–8, 2026", next: "OCT 20, 2026" },
  { id: 8, theme: "Culture Capital", name: "Mindelo Property", cat: "cabo-verde", destinations: "Mindelo, São Vicente", tags: ["5 days", "Tourism Focus", "Culture"], price: "€1,200", desc: "Discover Cabo Verde's cultural heartland. View harbour-front apartments, boutique guesthouses, and tourism-driven investment opportunities in one of Africa's most beloved island cities.", spots: 7, total: 9, badge: null, date: "SEP 22–27, 2026", next: "NOV 17, 2026" },
  { id: 9, theme: "Dual Market", name: "The Dual-Market Tour", cat: "combined", destinations: "Lisbon + Praia — Portugal & Cabo Verde", tags: ["7 days", "Investment", "2 Markets"], price: "€2,400", desc: "The flagship KnC experience. Spend 3 days viewing properties in Lisbon then fly to Praia for 4 days of Cabo Verde viewings. Two markets, one trip, total clarity on where to buy first.", spots: 4, total: 6, badge: "Best Value", date: "OCT 1–8, 2026", next: null },
  { id: 10, theme: "Premium Living", name: "Luxury Seeker", cat: "portugal", destinations: "Lisbon · Cascais · Algarve", tags: ["5 days", "Luxury", "Lifestyle"], price: "€1,290", desc: "Portugal's finest addresses, from the Estoril Riviera to Vilamoura's marina. For the buyer with a budget above €500K who wants to understand where premium value lives.", spots: 3, total: 9, badge: null, date: "NOV 3–8, 2026", next: null },
];

const destPremiums: Record<string, number> = {
  lisbon: 0,
  lisbon_setubal: 150,
  lisbon_algarve: 350,
  lisbon_porto: 350,
  porto: 350,
  algarve: 350,
  cabo_verde_single: 600,
  cabo_verde_multi: 900,
  portugal_cabo_verde: 850,
  custom: 0,
};

const servicePrices: Record<string, number> = {
  "Lawyer meeting (NIF, legal)": 200,
  "Mortgage broker session": 150,
  "Accountant / Tax advisor": 150,
  "Contractor walkthrough": 180,
  "Power of attorney setup": 250,
  "NIF application assistance": 120,
  "Visa process consultation": 200,
  "Post-trip written report": 120,
};

const imgClasses = [
  "ti-lisbon", "ti-porto", "ti-algarve", "ti-praia", "ti-lisbon",
  "ti-combined", "ti-praia", "ti-mindelo", "ti-combined", "ti-algarve"
];

const flags = ["🇵🇹", "🇵🇹", "🇵🇹", "🇵🇹", "🇵🇹", "🇨🇻", "🇨🇻", "🇨🇻", "🇵🇹🇨🇻", "🇵🇹"];

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function LanguageSwitcher({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
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
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("v");
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`fu ${className}`} style={style}>
      {children}
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [lang, setLang] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "portugal" | "cabo-verde" | "combined">("all");
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);

  // --- Form Success States ---
  const [privateSuccess, setPrivateSuccess] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // --- Submitting States ---
  const [pIsSubmitting, setPIsSubmitting] = useState(false);
  const [wIsSubmitting, setWIsSubmitting] = useState(false);

  // --- Private Tour Form State ---
  const [pFname, setPFname] = useState("");
  const [pLname, setPLname] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pCountry, setPCountry] = useState("");
  const [pNationality, setPNationality] = useState("");
  const [pDays, setPDays] = useState("");
  const [pGuests, setPGuests] = useState("");
  const [pDate1, setPDate1] = useState("");
  const [pDate2, setPDate2] = useState("");
  const [pDest, setPDest] = useState("");
  const [pHotel, setPHotel] = useState("3");
  const [pNotes, setPNotes] = useState("");
  const [pSelectedVibes, setPSelectedVibes] = useState<string[]>([]);
  const [pSelectedProperties, setPSelectedProperties] = useState<string[]>([]);
  const [pSelectedServices, setPSelectedServices] = useState<string[]>([]);
  const [pSelectedCVIslands, setPSelectedCVIslands] = useState<string[]>([]);

  // --- Waitlist Form State ---
  const [wFname, setWFname] = useState("");
  const [wLname, setWLname] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wPhone, setWPhone] = useState("");
  const [wCountry, setWCountry] = useState("");
  const [wNationality, setWNationality] = useState("");
  const [wDest, setWDest] = useState("");
  const [wDates, setWDates] = useState("");
  const [wSelectedVibes, setWSelectedVibes] = useState<string[]>([]);
  const [wSelectedThemes, setWSelectedThemes] = useState<string[]>([]);
  const [wSelectedServices, setWSelectedServices] = useState<string[]>([]);
  const [wBudget, setWBudget] = useState("");
  const [wType, setWType] = useState("");
  const [wNotes, setWNotes] = useState("");

  // --- Newsletter Form State ---
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlSubscribed, setNlSubscribed] = useState(false);

  // Translation helper
  const t = (path: string) => {
    const keys = path.split('.');
    let obj: any = TRANSLATIONS[lang];
    for (const key of keys) {
      obj = obj?.[key];
    }
    return obj || path;
  };

  const translate = (key: string, defaultText: string) => {
    const val = t(key);
    if (val === key) {
      return defaultText;
    }
    return val;
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  // Handle vibe select for forms (maximum of 2 vibes)
  const toggleVibe = (form: "private" | "waitlist", vibe: string) => {
    if (form === "private") {
      setPSelectedVibes(prev => {
        if (prev.includes(vibe)) {
          return prev.filter(v => v !== vibe);
        } else if (prev.length < 2) {
          return [...prev, vibe];
        }
        return prev;
      });
    } else {
      setWSelectedVibes(prev => {
        if (prev.includes(vibe)) {
          return prev.filter(v => v !== vibe);
        } else if (prev.length < 2) {
          return [...prev, vibe];
        }
        return prev;
      });
    }
  };

  // Toggle checklist arrays
  const toggleCheckbox = (list: string, value: string) => {
    if (list === "p_properties") {
      setPSelectedProperties(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (list === "p_services") {
      setPSelectedServices(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (list === "p_cvIslands") {
      setPSelectedCVIslands(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (list === "w_themes") {
      setWSelectedThemes(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (list === "w_services") {
      setWSelectedServices(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  // Dynamic Price Calculator
  const privatePriceEstimation = useMemo(() => {
    const days = parseInt(pDays) || 0;
    const guests = parseInt(pGuests) || 0;
    if (!days || !guests || !pDest) return null;

    const dayRate = days <= 2 ? 350 : days <= 5 ? 290 : 250;
    const soloAdj = guests === 1 ? 80 : guests >= 3 ? -40 : 0;
    const baseTotal = (dayRate + soloAdj) * days * guests;
    const destPremium = destPremiums[pDest] || 0;
    const hotelRate = pHotel === "4" ? 60 : pHotel === "5" ? 140 : 0;
    const hotelTotal = hotelRate * days * guests;

    let svcTotal = 0;
    const activeServices: { label: string; price: number }[] = [];
    pSelectedServices.forEach(svcName => {
      const price = servicePrices[svcName] || 0;
      svcTotal += price;
      activeServices.push({ label: svcName, price });
    });

    const total = baseTotal + destPremium + hotelTotal + svcTotal;

    return {
      dayRate,
      soloAdj,
      baseTotal,
      destPremium,
      hotelTotal,
      hotelRate,
      activeServices,
      total,
    };
  }, [pDays, pGuests, pDest, pHotel, pSelectedServices]);

  // Submit Private Tour Inquiry
  const handlePrivateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pFname.trim() || !pEmail.trim() || !pPhone.trim() || !pCountry.trim() || !pDays || !pGuests || !pDest) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields marked with *.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPIsSubmitting(true);
      
      const payloadNotes = `Number of Days: ${pDays}
Number of Guests: ${pGuests}
Primary Destination: ${pDest}
${pDest.includes("cabo") ? `Selected Islands: ${pSelectedCVIslands.join(", ")}` : ""}
Hotel Preference: ${pHotel}-star
Vibes: ${pSelectedVibes.join(", ")}
Property Types: ${pSelectedProperties.join(", ")}
Services Requested: ${pSelectedServices.join(", ")}
Preferred Start Date: ${pDate1}
Alternative Date: ${pDate2}
Estimated Price Total: ${privatePriceEstimation?.total ? `€${privatePriceEstimation.total.toLocaleString()}` : "N/A"}
User Notes: ${pNotes}`;

      const formData = {
        fullName: `${pFname} ${pLname}`.trim(),
        email: pEmail,
        whatsapp: pPhone,
        joining: `${pGuests} guests`,
        joiningOther: "",
        successGoal: `Private Tour Request for ${pDest}`,
        priorities: pSelectedVibes,
        specificAreas: pSelectedProperties.join(", "),
        budget: "",
        propertyTypes: pSelectedProperties,
        logistics: pSelectedServices,
        pace: `${pHotel}-star hotel`,
        dietary: "",
        notes: payloadNotes,
      };

      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: formData });
      if (error) throw error;

      setPrivateSuccess(true);
      toast({
        title: "Inquiry sent",
        description: "Thank you! We'll review your details and send a custom quote within 48 hours.",
      });

      // Scroll to the private section top
      const sec = document.getElementById("private");
      if (sec) {
        sec.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Private form error:", error);
      toast({
        title: "Failed to send",
        description: "Something went wrong while sending your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPIsSubmitting(false);
    }
  };

  // Submit Waitlist Form
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wFname.trim() || !wEmail.trim() || !wPhone.trim() || !wCountry.trim() || !wDest) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields marked with *.",
        variant: "destructive",
      });
      return;
    }

    try {
      setWIsSubmitting(true);

      const payloadNotes = `Preferred Destination: ${wDest}
Preferred Travel Window: ${wDates}
Selected Vibe: ${wSelectedVibes.join(", ")}
Selected Themes: ${wSelectedThemes.join(", ")}
Services Requested: ${wSelectedServices.join(", ")}
Property Budget: ${wBudget}
Preference format: ${wType}
Additional notes: ${wNotes}`;

      const formData = {
        fullName: `${wFname} ${wLname}`.trim(),
        email: wEmail,
        whatsapp: wPhone,
        joining: wType || "Waitlist Request",
        joiningOther: "",
        successGoal: `Waitlist Inquiry - Vibe: ${wSelectedVibes.join(", ")}`,
        priorities: wSelectedVibes,
        specificAreas: `Themes: ${wSelectedThemes.join(", ")}`,
        budget: wBudget,
        propertyTypes: [],
        logistics: wSelectedServices,
        pace: "Group/Private preference: " + wType,
        dietary: "",
        notes: payloadNotes,
      };

      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: formData });
      if (error) throw error;

      setWaitlistSuccess(true);
      toast({
        title: "Joined Waitlist",
        description: "You've successfully joined the waitlist. We'll be in touch within 5 business days.",
      });

      const sec = document.getElementById("waitlist");
      if (sec) {
        sec.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Failed to submit",
        description: "Something went wrong while joining the waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setWIsSubmitting(false);
    }
  };

  // Submit Newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlSubscribed(true);
    toast({
      title: "Subscribed",
      description: "Thank you for subscribing to the Kings 'n Company newsletter!",
    });
  };

  // Open detail modal and prefill waitlist selections
  const openModal = (idx: number) => {
    setCurrentModalIndex(idx);
  };

  const closeModal = () => {
    setCurrentModalIndex(null);
  };

  const handleJoinWaitlistFromModal = () => {
    if (currentModalIndex === null) return;
    const trip = groupTrips[currentModalIndex];
    closeModal();

    // Scroll to waitlist form
    const sec = document.getElementById("waitlist");
    if (sec) {
      sec.scrollIntoView({ behavior: "smooth" });
    }

    // Prefill themes state
    const themeLabel = `${trip.name} — ${trip.destinations.split("·")[0].trim()}`;
    setWSelectedThemes(prev => {
      if (!prev.includes(themeLabel)) {
        return [...prev, themeLabel];
      }
      return prev;
    });
  };

  const handleJoinWaitlistForIndex = (idx: number) => {
    const trip = groupTrips[idx];
    const sec = document.getElementById("waitlist");
    if (sec) {
      sec.scrollIntoView({ behavior: "smooth" });
    }

    const themeLabel = `${trip.name} — ${trip.destinations.split("·")[0].trim()}`;
    setWSelectedThemes(prev => {
      if (!prev.includes(themeLabel)) {
        return [...prev, themeLabel];
      }
      return prev;
    });
  };

  // Filter trips for the Featured grid
  const filteredFeaturedTrips = useMemo(() => {
    const list = featuredFilter === "all" ? groupTrips : groupTrips.filter(t => t.cat === featuredFilter);
    return list.slice(0, 6);
  }, [featuredFilter]);

  return (
    <div className="tour-page">
      {/* ── BACK BUTTON ── */}
      <div style={{ position: "fixed", top: 24, left: 24, zIndex: 1010, display: "flex", gap: 12 }}>
        <button className="back-btn" onClick={() => navigate("/services")} title={translate('back', 'Services')}>
          <ArrowLeft size={16} />
          <span>{translate('back', 'Services')}</span>
        </button>
      </div>

      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 1010 }}>
        <LanguageSwitcher current={lang} onChange={setLang} />
      </div>

      {/* NAV */}
      <nav id="mainNav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">KnC</div>
          <div className="nav-logo-text">
            Kings 'n Company
            <span>Property Ownership Tours</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#tours">Our Tours</a></li>
          <li><a href="#destinations">Destinations</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#testimonials">Stories</a></li>
          <li><a href="#waitlist" className="nav-cta">Reserve Your Spot</a></li>
        </ul>
        <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={22} className="text-black" /> : <span></span>}
          {!mobileMenuOpen && (
            <>
              <span></span>
              <span></span>
            </>
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} id="mobileMenu">
        <a href="#tours" onClick={toggleMobileMenu}>Our Tours</a>
        <a href="#destinations" onClick={toggleMobileMenu}>Destinations</a>
        <a href="#how" onClick={toggleMobileMenu}>How It Works</a>
        <a href="#testimonials" onClick={toggleMobileMenu}>Stories</a>
        <a href="#waitlist" onClick={toggleMobileMenu}>Reserve Your Spot</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grain"></div>
        <div className="hero-radial"></div>
        <div className="hero-eyebrow">Kings 'n Company — Property Ownership Tours</div>
        <h1>
          See it.
          <br />
          <em>Understand it.</em>
          <br />
          Own it.
        </h1>
        <p className="hero-sub">
          Curated property exploration experiences across Portugal and Cabo Verde. For the diaspora investor who wants to walk the ground before signing the contract.
        </p>
        <div className="hero-ctas">
          <a href="#private" className="btn-p">Book Private Tour</a>
          <a href="#waitlist" className="btn-o">Join a Group Tour</a>
        </div>
        <div className="hero-stats">
          <div className="h-stat">
            <span className="h-stat-n">10</span>
            <span className="h-stat-l">Destinations</span>
          </div>
          <div className="h-stat">
            <span className="h-stat-n">10</span>
            <span className="h-stat-l">Group Themes</span>
          </div>
          <div className="h-stat">
            <span className="h-stat-n">1–10</span>
            <span className="h-stat-l">Days, Private</span>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="sb">
          <div className="sb-n">47+</div>
          <div className="sb-l">Investors Hosted</div>
        </div>
        <div className="sb">
          <div className="sb-n">2</div>
          <div className="sb-l">Countries</div>
        </div>
        <div className="sb">
          <div className="sb-n">€260K</div>
          <div className="sb-l">Avg Deal Size</div>
        </div>
        <div className="sb">
          <div className="sb-n">100%</div>
          <div className="sb-l">Guided End-to-End</div>
        </div>
      </div>

      {/* WHAT'S INCLUDED */}
      <section className="includes-section" id="includes">
        <div className="container">
          <div className="section-eyebrow">Every Tour</div>
          <h2 className="section-title">
            What comes
            <br />
            <em>standard</em>
          </h2>
          <div className="includes-grid">
            <div className="include-card">
              <span className="include-icon">🛎</span>
              <div className="include-title">Hotel Included</div>
              <p className="include-desc">
                3-star accommodation, upgraded tiers available. Negotiated group rates ensure quality without overpaying.
              </p>
            </div>
            <div className="include-card">
              <span className="include-icon">🚐</span>
              <div className="include-title">Private Transport</div>
              <p className="include-desc">
                Dedicated driver between all property visits, neighborhoods, and activities. No taxis, no confusion.
              </p>
            </div>
            <div className="include-card">
              <span className="include-icon">☀️</span>
              <div className="include-title">Breakfast + Lunch</div>
              <p className="include-desc">
                Breakfast at the hotel, lunch at a curated local restaurant chosen for the day's area and energy.
              </p>
            </div>
            <div className="include-card">
              <span className="include-icon">📋</span>
              <div className="include-title">Consultation & Debrief</div>
              <p className="include-desc">
                A call before you arrive, and a structured final session before you leave. You come with questions. You leave with a plan.
              </p>
            </div>
            <div className="include-card">
              <span className="include-icon">🏛</span>
              <div className="include-title">Airport Transfers</div>
              <p className="include-desc">
                Pickup and drop-off included for private tours. Group tours include an optional shared shuttle.
              </p>
            </div>
            <div className="include-card">
              <span className="include-icon">🎭</span>
              <div className="include-title">One Curated Activity</div>
              <p className="include-desc">
                A boat tour, cultural workshop, or community event matched to your group's vibe. Context matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO WAYS TO EXPLORE */}
      <section className="tour-types" id="overview">
        <div className="container">
          <div className="section-eyebrow">Choose Your Format</div>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            Two ways to
            <br />
            <em>explore</em>
          </h2>
          <div className="tour-format-grid">
            <a href="#private" className="format-card">
              <span className="format-label">Fully Customized</span>
              <h3>Private Tour</h3>
              <p>
                Built entirely around your goals, timeline, and preferred vibe. You choose where, how long, what services you need, and what type of properties you want to see.
              </p>
              <div className="format-meta">
                <div className="fmeta-item"><span className="fmeta-dot"></span>1 to 10 days</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>Portugal or Cabo Verde</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>Up to 4 people</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>Add lawyer, mortgage, accountant</div>
              </div>
              <div className="format-price">From €350 / day per person</div>
              <div className="format-arrow">→</div>
            </a>
            <a href="#waitlist" className="format-card">
              <span className="format-label">Themed Itineraries</span>
              <h3>Group Tour</h3>
              <p>
                Join a curated group of 5–9 investors with a shared vibe. Ten preset themes, from coastal to cosmopolitan. We launch the trip when the group fills.
              </p>
              <div className="format-meta">
                <div className="fmeta-item"><span className="fmeta-dot"></span>3 or 5 days</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>5–9 participants</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>10 preset themes</div>
                <div className="fmeta-item"><span class="fmeta-dot"></span>Pre-trip 1-on-1 call included</div>
              </div>
              <div className="format-price">From €790 / person</div>
              <div className="format-arrow">→</div>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="tours-section" id="tours">
        <div className="container">
          <div className="tours-header">
            <div>
              <div className="section-eyebrow">Upcoming Tours</div>
              <h2 className="section-title">
                Choose Your
                <br />
                <em>Ownership Journey</em>
              </h2>
            </div>
            <a href="#waitlist" className="see-all">View All Dates →</a>
          </div>
          <div className="tour-tabs">
            <button
              className={`ttab ${featuredFilter === "all" ? "active" : ""}`}
              onClick={() => setFeaturedFilter("all")}
            >
              All Tours
            </button>
            <button
              className={`ttab ${featuredFilter === "portugal" ? "active" : ""}`}
              onClick={() => setFeaturedFilter("portugal")}
            >
              Portugal
            </button>
            <button
              className={`ttab ${featuredFilter === "cabo-verde" ? "active" : ""}`}
              onClick={() => setFeaturedFilter("cabo-verde")}
            >
              Cabo Verde
            </button>
            <button
              className={`ttab ${featuredFilter === "combined" ? "active" : ""}`}
              onClick={() => setFeaturedFilter("combined")}
            >
              Combined
            </button>
          </div>

          <div className="tours-grid" id="featuredGrid">
            {filteredFeaturedTrips.map((trip) => {
              const globalIndex = groupTrips.findIndex(t => t.id === trip.id);
              const isFew = trip.spots >= 7;
              return (
                <a
                  key={trip.id}
                  className="tour-card"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(globalIndex);
                  }}
                  href="#"
                >
                  <div className="tour-img">
                    <div className={`tour-img-inner ${imgClasses[globalIndex]}`}></div>
                    {trip.badge && <span className="tour-badge gold">{trip.badge}</span>}
                    <span className="tour-flag">{flags[globalIndex]}</span>
                    <span className={`tour-spots ${isFew ? "few" : ""}`}>
                      {isFew ? `${trip.total - trip.spots} spots left` : `${trip.spots} of ${trip.total} joined`}
                    </span>
                  </div>
                  <div className="tour-body">
                    <div className="tour-loc">{trip.destinations.split("·")[0].trim()}</div>
                    <div className="tour-title">{trip.name}</div>
                    <div className="tour-desc">{trip.desc.substring(0, 90)}...</div>
                    <div className="tour-meta">
                      {trip.tags.map((tag) => (
                        <span key={tag} className="tour-pill">{tag}</span>
                      ))}
                    </div>
                    <div className="tour-footer">
                      <div className="tour-price">
                        <strong>{trip.price}</strong>
                        per person
                      </div>
                      <div className="tour-date">
                        {trip.date}
                        <span>Next: {trip.next || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="dest-section" id="destinations">
        <div className="container">
          <div className="section-eyebrow">Where We Go</div>
          <h2 class="section-title">
            Two countries.
            <br />
            <em>Endless opportunity.</em>
          </h2>
          <div className="dest-grid">
            <div className="dest-card">
              <div className="dest-bg-inner db-lisbon"></div>
              <div className="dest-ov"></div>
              <div className="dest-cnt">
                <div className="dest-ctry">Portugal</div>
                <div className="dest-name">Lisbon</div>
                <div className="dest-detail">Estrela · Mouraria · Alcântara · Marvila · Belém</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-bg-inner db-porto"></div>
              <div className="dest-ov"></div>
              <div className="dest-cnt">
                <div className="dest-ctry">Portugal</div>
                <div className="dest-name">Porto</div>
                <div className="dest-detail">Bonfim · Paranhos · Cedofeita</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-bg-inner db-algarve"></div>
              <div className="dest-ov"></div>
              <div className="dest-cnt">
                <div className="dest-ctry">Portugal</div>
                <div className="dest-name">Algarve</div>
                <div className="dest-detail">Lagos · Portimão · Silves · Tavira</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-bg-inner db-cv"></div>
              <div className="dest-ov"></div>
              <div className="dest-cnt">
                <div className="dest-ctry">Cabo Verde</div>
                <div className="dest-name">Santiago + Sal</div>
                <div className="dest-detail">Praia · Mindelo · Sal Island</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="how-section" id="how">
        <div className="how-sticky">
          <div className="section-eyebrow">The KnC Process</div>
          <h2>
            From Inquiry
            <br />
            to <em>Keys in Hand.</em>
          </h2>
          <p>
            We built a proven system so diaspora investors never navigate a foreign property market alone. Bilingual. Transparent. Built for you.
          </p>
          <div className="report-card">
            <div className="report-card-head">Lisbon</div>
            <div className="report-card-body">
              <h3>Sample Post-Tour Report</h3>
              <p>Estrela district · 3 properties reviewed · July 2026 tour cohort</p>
              <div className="report-tags">
                <span className="report-tag">NIF Guide</span>
                <span className="report-tag">CPCV Template</span>
                <span className="report-tag">Yield Calc</span>
                <span className="report-tag">Solicitor Contacts</span>
                <span className="report-tag">Tax Summary</span>
              </div>
            </div>
          </div>
        </div>
        <div className="how-steps">
          <div className="how-step">
            <div className="hs-n">01</div>
            <div className="hs-b">
              <h4>Apply for Your Tour</h4>
              <p>Submit your budget, target market, and buying timeline. We confirm your tour date and match you with the right property shortlist within 48 hours.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="hs-n">02</div>
            <div className="hs-b">
              <h4>Pre-Tour Briefing</h4>
              <p>One week before departure, we hold a 60-minute video call covering your shortlist, tax implications, visa options, and what to bring to property viewings.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="hs-n">03</div>
            <div className="hs-b">
              <h4>The Tour — 5 Days on the Ground</h4>
              <p>Curated property viewings, neighborhood walks, legal and financial briefings, and one cultural experience that helps you understand where you're investing.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="hs-n">04</div>
            <div className="hs-b">
              <h4>Solicitor Day</h4>
              <p>A dedicated session with a bilingual solicitor and, if needed, a mortgage broker. Walk through the legal structure, understand your obligations, and ask every question you have.</p>
            </div>
          </div>
          <div className="how-step">
            <div className="hs-n">05</div>
            <div className="hs-b">
              <h4>Post-Tour Report & Follow-Up</h4>
              <p>Within 5 days of your tour, you receive a written report: property shortlist, solicitor notes, tax overview, and your recommended next steps.</p>
            </div>
          </div>
        </div>
      </div>

      {/* GROUP TOURS WITH WAITLIST */}
      <section className="group-section" id="group">
        <div className="container">
          <div className="section-eyebrow">Group Tours</div>
          <h2 className="section-title">
            Ten themed
            <br />
            <em>journeys</em>
          </h2>
          <p className="section-desc">
            Join a curated group of 5–9 investors. We launch the trip when the group fills. Join the waitlist, attend your individual pre-trip call, and arrive ready to decide.
          </p>
          <div className="group-grid" id="groupGrid">
            {groupTrips.map((trip, i) => {
              const pct = Math.round((trip.spots / trip.total) * 100);
              const spotsLeft = trip.total - trip.spots;
              return (
                <div key={trip.id} className="group-card" onClick={() => openModal(i)}>
                  <div className="gc-num">0{trip.id}</div>
                  <span className="gc-theme">{trip.theme}</span>
                  <div className="gc-name">{trip.name}</div>
                  <div className="gc-dest">{trip.destinations}</div>
                  <div className="gc-tags">
                    {trip.tags.map((tag) => (
                      <span key={tag} className="gc-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="wl-bar">
                    <div className="wl-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="wl-label">
                    <strong>{trip.spots}</strong> of {trip.total} spots filled · <strong>{spotsLeft} remaining</strong>
                  </div>
                  <div className="gc-footer">
                    <div className="gc-price">
                      {trip.price} <span>/ person</span>
                    </div>
                    <button
                      className="btn-waitlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinWaitlistForIndex(i);
                      }}
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="test-section" id="testimonials">
        <div className="container">
          <div className="section-eyebrow">From Our Travellers</div>
          <h2 className="section-title">
            Real Investors.
            <br />
            <em>Real Results.</em>
          </h2>
          <div className="test-grid">
            <div className="test-card">
              <div className="tq">"</div>
              <p className="tt">
                I came on the Lisbon tour in March not sure if I was ready. By day 3 I had a solicitor and a property I loved. I signed the CPCV six weeks later. Kings 'n Company made it real.
              </p>
              <div className="ta">
                <div className="ta-av av1">MJ</div>
                <div>
                  <div className="ta-name">Marcus J.</div>
                  <div className="ta-orig">Atlanta, GA · Lisbon Property Owner</div>
                </div>
              </div>
            </div>
            <div className="test-card">
              <div className="tq">"</div>
              <p className="tt">
                The dual-market tour changed how I see my money. I bought in Praia and I'm now under offer in Porto. Ismael and the team know every corner of both markets and it shows.
              </p>
              <div className="ta">
                <div className="ta-av av2">AF</div>
                <div>
                  <div className="ta-name">Amina F.</div>
                  <div className="ta-orig">London, UK · Porto & Praia Investor</div>
                </div>
              </div>
            </div>
            <div className="test-card">
              <div className="tq">"</div>
              <p className="tt">
                As a first-time buyer abroad the legal side terrified me. Having the solicitor day built into the tour and getting that written report after made me feel protected the whole way through.
              </p>
              <div className="ta">
                <div className="ta-av av3">DS</div>
                <div>
                  <div className="ta-name">David S.</div>
                  <div className="ta-orig">Toronto, CA · Algarve Property Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVATE TOUR FORM */}
      <section className="form-section" id="private">
        <div className="container">
          <div className="section-eyebrow">{translate('private.label', 'Prefer Something Custom?')}</div>
          <h2 className="section-title">
            Design your
            <br />
            <em>experience</em>
          </h2>
          <p className="section-desc">
            Tell us what you're looking for. We'll review your submission and send a tailored quote within 48 hours, along with availability for your first consultation call.
          </p>
          
          {!privateSuccess ? (
            <form onSubmit={handlePrivateFormSubmit} className="form-wrap" id="privateFormWrap">
              <div className="form-header">
                <h3>Private Tour Inquiry</h3>
                <p>All fields marked <span className="req">*</span> are required. The more detail you share, the more precise your quote.</p>
              </div>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text">About You</div>
                <div className="divider-line"></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p_fname">First Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="p_fname"
                    placeholder="Your first name"
                    value={pFname}
                    onChange={(e) => setPFname(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p_lname">Last Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="p_lname"
                    placeholder="Your last name"
                    value={pLname}
                    onChange={(e) => setPLname(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p_email">Email <span className="req">*</span></label>
                  <input
                    type="email"
                    id="p_email"
                    placeholder="email@example.com"
                    value={pEmail}
                    onChange={(e) => setPEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p_phone">WhatsApp Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="p_phone"
                    placeholder="+1 555 000 0000"
                    value={pPhone}
                    onChange={(e) => setPPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p_country">Country of Residence <span className="req">*</span></label>
                  <input
                    type="text"
                    id="p_country"
                    placeholder="e.g. United States"
                    value={pCountry}
                    onChange={(e) => setPCountry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p_nationality">Nationality</label>
                  <input
                    type="text"
                    id="p_nationality"
                    placeholder="e.g. American, Guinean..."
                    value={pNationality}
                    onChange={(e) => setPNationality(e.target.value)}
                  />
                </div>
              </div>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text">Trip Details</div>
                <div className="divider-line"></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p_days">Number of Days <span className="req">*</span></label>
                  <select
                    id="p_days"
                    value={pDays}
                    onChange={(e) => setPDays(e.target.value)}
                    required
                  >
                    <option value="">Select duration</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                      <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="p_guests">Number of Guests <span className="req">*</span></label>
                  <select
                    id="p_guests"
                    value={pGuests}
                    onChange={(e) => setPGuests(e.target.value)}
                    required
                  >
                    <option value="">Select guests</option>
                    <option value="1">1 person (solo)</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p_date1">Preferred Start Date</label>
                  <input
                    type="text"
                    id="p_date1"
                    placeholder="e.g. September 2026, flexible"
                    value={pDate1}
                    onChange={(e) => setPDate1(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p_date2">Alternative Date</label>
                  <input
                    type="text"
                    id="p_date2"
                    placeholder="Second option if available"
                    value={pDate2}
                    onChange={(e) => setPDate2(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p_dest">Primary Destination <span class="req">*</span></label>
                <select
                  id="p_dest"
                  value={pDest}
                  onChange={(e) => setPDest(e.target.value)}
                  required
                >
                  <option value="">Select destination</option>
                  <option value="lisbon">Lisbon District only</option>
                  <option value="lisbon_setubal">Lisbon + Setúbal</option>
                  <option value="lisbon_algarve">Lisbon + Algarve</option>
                  <option value="lisbon_porto">Lisbon + Porto</option>
                  <option value="porto">Porto area only</option>
                  <option value="algarve">Algarve only</option>
                  <option value="cabo_verde_single">Cabo Verde – single island</option>
                  <option value="cabo_verde_multi">Cabo Verde – multi-island (2+)</option>
                  <option value="portugal_cabo_verde">Portugal + Cabo Verde</option>
                  <option value="custom">Other / Custom region</option>
                </select>
              </div>

              {pDest && pDest.includes("cabo") && (
                <div className="form-group" id="cvIslandGroup">
                  <label>Cabo Verde Islands</label>
                  <div className="check-grid">
                    {["Santiago", "São Vicente", "Sal Island", "Boa Vista"].map((isl) => (
                      <div
                        key={isl}
                        className={`check-item ${pSelectedCVIslands.includes(isl) ? "checked" : ""}`}
                        onClick={() => toggleCheckbox("p_cvIslands", isl)}
                      >
                        <div className="check-box"></div>
                        <span className="check-label">{isl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Your Vibe (select up to 2) <span className="req">*</span></label>
                <div className="vibe-grid">
                  {[
                    { icon: "📊", name: "Investment", desc: "ROI, yield, off-plan" },
                    { icon: "🌿", name: "Lifestyle", desc: "Quality of life, community" },
                    { icon: "🌊", name: "Beach", desc: "Coastal, marina, sea views" },
                    { icon: "🏙", name: "City", desc: "Urban, central, walkable" },
                    { icon: "🌲", name: "Nature", desc: "Rural, quintas, mountains" },
                    { icon: "✨", name: "Luxury", desc: "Premium properties" },
                  ].map((v) => (
                    <div
                      key={v.name}
                      className={`vibe-card ${pSelectedVibes.includes(v.name) ? "selected" : ""}`}
                      onClick={() => toggleVibe("private", v.name)}
                    >
                      <span className="vibe-icon">{v.icon}</span>
                      <span className="vibe-name">{v.name}</span>
                      <span className="vibe-desc">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Types of Properties to Visit</label>
                <div className="check-grid">
                  {[
                    "Apartments (urban)", "Houses / Villas", "New development / off-plan",
                    "Renovation projects", "Quintas / Rural", "Commercial / Mixed-use",
                    "Land / Plots", "Surprise me"
                  ].map((prop) => (
                    <div
                      key={prop}
                      className={`check-item ${pSelectedProperties.includes(prop) ? "checked" : ""}`}
                      onClick={() => toggleCheckbox("p_properties", prop)}
                    >
                      <div className="check-box"></div>
                      <span className="check-label">{prop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Additional Services</label>
                <div className="check-grid">
                  {Object.keys(servicePrices).map((svc) => (
                    <div
                      key={svc}
                      className={`check-item ${pSelectedServices.includes(svc) ? "checked" : ""}`}
                      onClick={() => toggleCheckbox("p_services", svc)}
                    >
                      <div className="check-box"></div>
                      <span className="check-label">{svc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p_hotel">Hotel Preference</label>
                <select
                  id="p_hotel"
                  value={pHotel}
                  onChange={(e) => setPHotel(e.target.value)}
                >
                  <option value="3">3-star (included)</option>
                  <option value="4">4-star (+€60/night)</option>
                  <option value="5">5-star / Boutique (+€140/night)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="p_notes">Anything Else We Should Know</label>
                <textarea
                  id="p_notes"
                  placeholder="Your timeline, specific neighborhoods, questions, dietary needs..."
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                ></textarea>
              </div>

              {privatePriceEstimation && (
                <div className="price-preview" id="pricePreview">
                  <span className="price-preview-label">Estimated Price</span>
                  <ul className="price-breakdown" id="priceBreakdown">
                    <li>
                      <span>
                        {pDays} days × €{privatePriceEstimation.dayRate + privatePriceEstimation.soloAdj}/day × {pGuests} guest(s)
                      </span>
                      <span>€{privatePriceEstimation.baseTotal.toLocaleString()}</span>
                    </li>
                    {privatePriceEstimation.destPremium > 0 && (
                      <li>
                        <span>Destination premium</span>
                        <span>€{privatePriceEstimation.destPremium.toLocaleString()}</span>
                      </li>
                    )}
                    {privatePriceEstimation.hotelTotal > 0 && (
                      <li>
                        <span>Hotel upgrade ({pDays} nights)</span>
                        <span>€{privatePriceEstimation.hotelTotal.toLocaleString()}</span>
                      </li>
                    )}
                    {privatePriceEstimation.activeServices.map(s => (
                      <li key={s.label}>
                        <span>{s.label}</span>
                        <span>€{s.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="price-total">
                    <span className="price-total-label">Estimated Total</span>
                    <span className="price-total-amount" id="priceTotal">
                      €{privatePriceEstimation.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="price-note">
                    This is an estimate. Final pricing confirmed in your custom quote. Price shown is for all guests combined.
                  </p>
                </div>
              )}

              <div style={{ marginTop: 36 }}>
                <button
                  type="submit"
                  disabled={pIsSubmitting}
                  className="btn-p"
                  style={{ width: "100%", padding: 20, fontSize: 12, borderRadius: 2 }}
                >
                  {pIsSubmitting ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
                  {pIsSubmitting ? "Requesting..." : "Request My Custom Quote"}
                </button>
                <p style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", marginTop: 14, lineHeight: 1.7 }}>
                  We'll respond within 48 hours with your tailored quote and availability for a consultation call. No commitment required.
                </p>
              </div>
            </form>
          ) : (
            <div className="success-msg" id="privateSuccess">
              <div className="icon">✉️</div>
              <h4>Your inquiry is on its way.</h4>
              <p>We'll review your details and send a tailored quote within 48 hours. Keep an eye on your email and WhatsApp.</p>
              <p style={{ marginTop: 16, fontSize: 11, color: "var(--gold)" }}>
                — Ismael Gomes Queta, Kings 'n Company
              </p>
            </div>
          )}
        </div>
      </section>

      {/* GROUP WAITLIST FORM */}
      <section className="form-section dark" id="waitlist">
        <div className="container">
          <div className="section-eyebrow">Join the Waitlist</div>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            Tell us where
            <br />
            <em>you want to go</em>
          </h2>
          <p className="section-desc" style={{ color: "rgba(255,255,255,0.4)" }}>
            Whether you're joining a group trip or considering a private tour, this form gives us everything we need to find the right experience for you. We'll be in touch within 5 business days.
          </p>

          {!waitlistSuccess ? (
            <form onSubmit={handleWaitlistSubmit} className="form-wrap" id="waitlistFormWrap">
              <div className="form-header">
                <h3>Waitlist & Inquiry Form</h3>
                <p>Complete this form to join a group waitlist, request a private tour, or both. We'll match you based on your preferences and available spots.</p>
              </div>

              <div className="divider" style={{ borderColor: "rgba(133,117,78,0.2)" }}>
                <div className="divider-line" style={{ background: "rgba(133,117,78,0.2)" }}></div>
                <div className="divider-text" style={{ color: "rgba(255,255,255,0.3)" }}>Contact Info</div>
                <div className="divider-line" style={{ background: "rgba(133,117,78,0.2)" }}></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="w_fname">First Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="w_fname"
                    placeholder="First name"
                    value={wFname}
                    onChange={(e) => setWFname(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="w_lname">Last Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="w_lname"
                    placeholder="Last name"
                    value={wLname}
                    onChange={(e) => setWLname(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="w_email">Email <span className="req">*</span></label>
                  <input
                    type="email"
                    id="w_email"
                    placeholder="email@example.com"
                    value={wEmail}
                    onChange={(e) => setWEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="w_phone">WhatsApp <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="w_phone"
                    placeholder="+1 555 000 0000"
                    value={wPhone}
                    onChange={(e) => setWPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="w_country">Country of Residence <span className="req">*</span></label>
                  <input
                    type="text"
                    id="w_country"
                    placeholder="Country"
                    value={wCountry}
                    onChange={(e) => setWCountry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="w_nationality">Nationality</label>
                  <input
                    type="text"
                    id="w_nationality"
                    placeholder="Nationality"
                    value={wNationality}
                    onChange={(e) => setWNationality(e.target.value)}
                  />
                </div>
              </div>

              <div className="divider" style={{ borderColor: "rgba(133,117,78,0.2)" }}>
                <div className="divider-line" style={{ background: "rgba(133,117,78,0.2)" }}></div>
                <div className="divider-text" style={{ color: "rgba(255,255,255,0.3)" }}>Your Goals</div>
                <div className="divider-line" style={{ background: "rgba(133,117,78,0.2)" }}></div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="w_dest">Preferred Destination <span className="req">*</span></label>
                  <select
                    id="w_dest"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                    value={wDest}
                    onChange={(e) => setWDest(e.target.value)}
                    required
                  >
                    <option value="">Select destination</option>
                    <option>Portugal</option>
                    <option>Cabo Verde</option>
                    <option>Both</option>
                    <option>Undecided</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="w_dates">Preferred Travel Window</label>
                  <input
                    type="text"
                    id="w_dates"
                    placeholder="e.g. Q3 2026, flexible..."
                    value={wDates}
                    onChange={(e) => setWDates(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Vibe (select up to 2)</label>
                <div className="vibe-grid">
                  {[
                    { icon: "📊", name: "Investment", desc: "ROI, yield, growth" },
                    { icon: "🌿", name: "Lifestyle", desc: "Quality of life, slow living" },
                    { icon: "🌊", name: "Beach", desc: "Coastal, maritime, sun" },
                    { icon: "🏙", name: "City", desc: "Urban, culture, walkability" },
                    { icon: "🌲", name: "Nature", desc: "Rural, mountains, off-grid" },
                    { icon: "✨", name: "Luxury", desc: "Premium living, high-end" },
                  ].map((v) => (
                    <div
                      key={v.name}
                      className={`vibe-card ${wSelectedVibes.includes(v.name) ? "selected" : ""}`}
                      onClick={() => toggleVibe("waitlist", v.name)}
                    >
                      <span className="vibe-icon">{v.icon}</span>
                      <span className="vibe-name">{v.name}</span>
                      <span className="vibe-desc">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>If group tours interest you, which themes?</label>
                <div className="check-grid" id="groupThemeChecks">
                  {groupTrips.map((trip) => {
                    const themeLabel = `${trip.name} — ${trip.destinations.split("·")[0].trim()}`;
                    return (
                      <div
                        key={trip.id}
                        className={`check-item ${wSelectedThemes.includes(themeLabel) ? "checked" : ""}`}
                        onClick={() => toggleCheckbox("w_themes", themeLabel)}
                      >
                        <div className="check-box"></div>
                        <span className="check-label">{themeLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Additional services of interest</label>
                <div className="check-grid">
                  {[
                    "Lawyer / Legal consultation",
                    "Mortgage broker",
                    "Tax / Accountant session",
                    "NIF + visa guidance"
                  ].map((srv) => (
                    <div
                      key={srv}
                      className={`check-item ${wSelectedServices.includes(srv) ? "checked" : ""}`}
                      onClick={() => toggleCheckbox("w_services", srv)}
                    >
                      <div className="check-box"></div>
                      <span className="check-label">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="w_budget">Property Budget (purchase)</label>
                  <select
                    id="w_budget"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                    value={wBudget}
                    onChange={(e) => setWBudget(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option>Under €100,000</option>
                    <option>€100,000 – €200,000</option>
                    <option>€200,000 – €350,000</option>
                    <option>€350,000 – €500,000</option>
                    <option>€500,000 – €1,000,000</option>
                    <option>Over €1,000,000</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="w_type">Your Preference</label>
                  <select
                    id="w_type"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                    value={wType}
                    onChange={(e) => setWType(e.target.value)}
                  >
                    <option value="">Select format</option>
                    <option value="group">Group tour (join waitlist)</option>
                    <option value="private">Private tour (custom experience)</option>
                    <option value="both">Both — help me decide</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="w_notes">Tell us more</label>
                <textarea
                  id="w_notes"
                  placeholder="Your situation, goals, timeline, specific questions..."
                  value={wNotes}
                  onChange={(e) => setWNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ marginTop: 36 }}>
                <button
                  type="submit"
                  disabled={wIsSubmitting}
                  className="btn-p"
                  style={{ width: "100%", padding: 20, fontSize: 12, borderRadius: 2 }}
                >
                  {wIsSubmitting ? <Loader2 className="animate-spin inline mr-2" size={14} /> : null}
                  {wIsSubmitting ? "Submitting..." : "Join the Waitlist"}
                </button>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 14, lineHeight: 1.7 }}>
                  No payment required at this stage. We'll confirm your spot and pricing before any commitment.
                </p>
              </div>
            </form>
          ) : (
            <div className="success-msg" id="waitlistSuccess">
              <div className="icon">🎯</div>
              <h4>You're on the list.</h4>
              <p>We'll be in touch within 5 business days to schedule your individual pre-trip call and confirm the right experience for you.</p>
              <p style={{ marginTop: 20, fontSize: 11, color: "var(--gold)" }}>
                — Ismael Gomes Queta, Kings 'n Company
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="nl-section container">
        <div className="nl-text">
          <div className="section-eyebrow">Stay Informed</div>
          <h2>
            New tours.
            <br />
            <em>New markets.</em>
            <br />
            First to know.
          </h2>
          <p>
            Get early access to new tour dates, market reports from Lisbon and Praia, and diaspora investor insights delivered to your inbox. No spam. Unsubscribe any time.
          </p>
        </div>
        {!nlSubscribed ? (
          <form onSubmit={handleNewsletterSubmit} className="nl-form">
            <div className="nl-row">
              <input
                type="text"
                placeholder="Your name"
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
              />
            </div>
            <div className="nl-row">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </div>
            <p className="nl-note">Join 600+ diaspora investors already subscribed.</p>
          </form>
        ) : (
          <div style={{ padding: "20px 0", color: "var(--gold)", fontWeight: 600 }}>
            🎉 You are subscribed! Welcome aboard.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="f-logo">
              <div className="f-logo-mark">KnC</div>
              <div className="f-logo-text">
                Kings 'n Company
                <span>Property Ownership Tours</span>
              </div>
            </div>
            <div className="f-tag">"Walk the ground<br />before signing the contract."</div>
            <div className="f-contact">
              <a href="mailto:hello@kingsncompany.com">hello@kingsncompany.com</a>
              <a href="https://kingsncompany.com" target="_blank" rel="noopener noreferrer">kingsncompany.com</a>
              <a>Lisbon, Portugal</a>
            </div>
          </div>
          <div className="f-col">
            <h4>Tours</h4>
            <ul>
              <li><a href="#private">Private Tours</a></li>
              <li><a href="#waitlist">Group Tours</a></li>
              <li><a href="#waitlist">Join Waitlist</a></li>
              <li><a href="#includes">What's Included</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Destinations</h4>
            <ul>
              <li><a href="#destinations">Lisbon</a></li>
              <li><a href="#destinations">Porto</a></li>
              <li><a href="#destinations">Algarve</a></li>
              <li><a href="#destinations">Cabo Verde</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About KnC</a></li>
              <li><a href="#">Our Process</a></li>
              <li><a href="#">Investor Stories</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <p>© 2026 Kings 'n Company — Lisbon, Portugal</p>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>
            Property Ownership Tours for the Diaspora Investor
          </p>
        </div>
      </footer>

      {/* MODAL OVERLAY */}
      {currentModalIndex !== null && (() => {
        const trip = groupTrips[currentModalIndex];
        const pct = Math.round((trip.spots / trip.total) * 100);
        return (
          <div
            className="modal-overlay open"
            id="modalOverlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <div className="modal">
              <button className="modal-close" onClick={closeModal}>×</button>
              <span className="modal-theme">{trip.theme}</span>
              <h3>{trip.name}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.9, margin: "16px 0 20px" }}>
                {trip.desc}
              </p>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {trip.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
                  <strong style={{ color: "var(--ink)" }}>Destinations:</strong> {trip.destinations}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
                  <strong style={{ color: "var(--ink)" }}>Next date:</strong> {trip.date}
                </div>
                <div className="wl-bar" style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                  <div className="wl-fill" style={{ width: `${pct}%`, height: "100%", background: "var(--gold)" }}></div>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                  {trip.spots} of {trip.total} spots filled · <strong style={{ color: "var(--gold)" }}>{trip.total - trip.spots} remaining</strong>
                </div>
              </div>
              <div style={{ paddingTop: 20, borderTop: "0.5px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>From</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--ink)" }}>
                      {trip.price}
                    </div>
                  </div>
                  <button className="btn-p" onClick={handleJoinWaitlistFromModal} style={{ borderRadius: 2 }}>
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
