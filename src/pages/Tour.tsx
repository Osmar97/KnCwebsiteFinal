import { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useToast } from "@/hooks/use-toast";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";
import PreTourFormModal, { PreTourFormData } from "@/components/tour/PreTourFormModal";
import InlineTourForm from "@/components/tour/InlineTourForm";
import TourDetailModal from "@/components/tour/TourDetailModal";
import { useTours, pickLocalized, nextTourDate, formatTourDateRange, type TourRow } from "@/hooks/useTours";
import { formatPrice, formatPriceShort } from "@/lib/formatPrice";
import { Reveal } from "@/components/tour/Reveal";
import { TourTopNav } from "@/components/tour/TourTopNav";
import { TourHero } from "@/components/tour/TourHero";
import { TourFooter } from "@/components/tour/TourFooter";
import {
  tourCategoryFilter,
  countryFromFlag,
  destBgClassFor,
  HOW_STEPS,
  TESTIMONIALS,
  INCLUDES,
} from "@/components/tour/tour-data";
import { useTourSubmissions } from "@/hooks/useTourSubmissions";

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();
  const { toast } = useToast();

  const [lang, setLang] = useState<Language>("en");
  const [showPreForm, setShowPreForm] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [privateSubmitted, setPrivateSubmitted] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isSubmittingPrivate, setIsSubmittingPrivate] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourRow | null>(null);
  const { tours, availability, loading: toursLoading } = useTours();
  const { isCheckingOut, isSendingEnquiry, handleCheckout, handleEnquiry, submitInlineForm } =
    useTourSubmissions();

  const t = (path: string) => {
    const keys = path.split(".");
    let obj: any = TRANSLATIONS[lang];
    for (const key of keys) obj = obj?.[key];
    return obj || path;
  };

  const onReserveSubmit = async (data: PreTourFormData) => {
    const ok = await handleCheckout(data);
    if (ok) setShowPreForm(false);
  };
  const onEnquirySubmit = async (data: PreTourFormData) => {
    const ok = await handleEnquiry(data);
    if (ok) setShowEnquiryForm(false);
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

  // Cheapest published prices, used to render the "From X" lines on the
  // "Two ways to explore" cards. Falls back to the cheapest tour of any type
  // when one of the categories is not yet seeded.
  const fallbackMin = tours.length
    ? Math.min(...tours.map((t) => Number(t.base_price) || Infinity))
    : null;
  const cheapestGroup = tours
    .filter((t) => t.tour_type === "group")
    .reduce<number | null>((min, t) => {
      const p = Number(t.base_price);
      return Number.isFinite(p) && (min === null || p < min) ? p : min;
    }, null);
  const cheapestPrivate = tours
    .filter((t) => t.tour_type === "private")
    .reduce<number | null>((min, t) => {
      const p = Number(t.base_price);
      return Number.isFinite(p) && (min === null || p < min) ? p : min;
    }, null);
  const defaultCurrency = tours[0]?.currency || "EUR";
  const groupFromPrice =
    cheapestGroup ?? fallbackMin ?? null;
  const privateFromPrice =
    cheapestPrivate ?? fallbackMin ?? null;

  // Group-tour cards are now sourced from the database (tour_type === 'group').
  const groupTours = tours.filter((t) => t.tour_type === "group");

  // Destinations are derived from published tours. We deduplicate by the
  // primary destination + country so the section auto-updates whenever a new
  // tour is published from the admin dashboard.
  const derivedDestinations = (() => {
    const seen = new Set<string>();
    const out: { key: string; bgClass: string; country: string; name: string; detail: string }[] = [];
    tours.forEach((t) => {
      const primary = t.destinations?.[0];
      if (!primary) return;
      const country = countryFromFlag(t.flag);
      const key = `${country}::${primary}`;
      if (seen.has(key)) return;
      seen.add(key);
      const rest = (t.destinations || []).slice(1).join(" · ");
      out.push({
        key,
        bgClass: destBgClassFor(t.hero_image, t.flag),
        country,
        name: primary,
        detail: rest || country,
      });
    });
    return out;
  })();

  return (
    <div className="tour-page">

      <TourTopNav lang={lang} setLang={setLang} t={t} onReserve={openReserveForm} isCheckingOut={isCheckingOut} />
      <TourHero
        t={t}
        destinationsCount={derivedDestinations.length}
        groupThemesCount={groupTours.length}
        onReserve={openReserveForm}
        isCheckingOut={isCheckingOut}
      />

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="sb"><div className="sb-n">47+</div><div className="sb-l">Investors Hosted</div></div>
        <div className="sb"><div className="sb-n">2</div><div className="sb-l">Countries</div></div>
        <div className="sb"><div className="sb-n">{formatPriceShort(260000, "EUR")}</div><div className="sb-l">Avg Deal Size</div></div>
        <div className="sb"><div className="sb-n">100%</div><div className="sb-l">Guided End-to-End</div></div>
      </div>

      {/* ── WHAT'S INCLUDED ── */}
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
              const price = formatPrice(card.base_price, card.currency);
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
              {derivedDestinations.length === 0 && !toursLoading && (
                <p style={{ opacity: 0.6 }}>Destinations will appear here when tours are published.</p>
              )}
              {derivedDestinations.map((d) => (
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
          <h2 className="section-title">Curated themed<br /><em>journeys</em></h2>
          <p className="section-desc">
            Join a curated group of 5–9 investors. We launch the trip when the group fills. Join the waitlist, attend your individual pre-trip call, and arrive ready to decide.
          </p>
          <Reveal>
            <div className="group-grid">
              {toursLoading && <p style={{ opacity: 0.6 }}>Loading group tours…</p>}
              {!toursLoading && groupTours.length === 0 && (
                <p style={{ opacity: 0.6 }}>No group tours announced yet. Check back soon.</p>
              )}
              {groupTours.map((tour, idx) => {
                const next = nextTourDate(tour.dates);
                const avail = next ? availability[next.id] : undefined;
                const cap = avail?.capacity ?? next?.capacity ?? 0;
                const filled = avail?.confirmed_count ?? 0;
                const remaining = avail?.remaining ?? Math.max(cap - filled, 0);
                const pct = cap > 0 ? Math.min((filled / cap) * 100, 100) : 0;
                const rec = tour as unknown as Record<string, unknown>;
                const localizedName = pickLocalized(rec, "name", lang);
                const num = String(idx + 1).padStart(2, "0");
                const destDetail = [tour.destinations?.[0], countryFromFlag(tour.flag)]
                  .filter(Boolean)
                  .join(", ") + (tour.duration_days ? ` · ${tour.duration_days} Days` : "");
                const fillLabel = cap > 0
                  ? `${filled}/${cap} spots filled`
                  : "Waitlist open";
                return (
                  <div key={tour.id} className="group-card">
                    <div className="gc-num">{num}</div>
                    <span className="gc-theme">{tour.category}</span>
                    <div className="gc-name">{localizedName}</div>
                    <div className="gc-dest">{destDetail}</div>
                    <div className="gc-tags">
                      {tour.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="gc-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="wl-bar">
                      <div className="wl-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="wl-label">
                      <strong>{fillLabel}</strong> — join the waitlist to lock your spot
                    </p>
                    <div className="gc-footer">
                      <div className="gc-price">
                        {formatPrice(tour.base_price, tour.currency)} <span>/ person</span>
                      </div>
                      <button className="btn-gold-outline" onClick={openEnquiryForm}>
                        {next?.sold_out ? t("tour_modal.sold_out") : "Join Waitlist"}
                      </button>
                    </div>
                  </div>
                );
              })}
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
