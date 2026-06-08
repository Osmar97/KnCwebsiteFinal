import { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { TRANSLATIONS, Language } from "./TourTranslations";
import "./Tour.css";
import PreTourFormModal, { PreTourFormData } from "@/components/tour/PreTourFormModal";
import TourDetailModal from "@/components/tour/TourDetailModal";
import { useTours, type TourRow } from "@/hooks/useTours";
import { TourTopNav } from "@/components/tour/TourTopNav";
import { TourHero } from "@/components/tour/TourHero";
import { TourFooter } from "@/components/tour/TourFooter";
import {
  countryFromFlag,
  destBgClassFor,
} from "@/components/tour/tour-data";
import { useTourSubmissions } from "@/hooks/useTourSubmissions";
import {
  IncludesSection,
  TwoWaysSection,
  DestinationsSection,
  HowItWorksSection,
  TestimonialsSection,
  NewsletterSection,
} from "@/components/tour/TourStaticSections";
import { TourFeaturedTours } from "@/components/tour/TourFeaturedTours";
import { TourGroupSection } from "@/components/tour/TourGroupSection";
import { PrivateTourSection, WaitlistSection } from "@/components/tour/TourFormSections";

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();

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

  const onReserveSubmit = async (data: PreTourFormData): Promise<void> => {
    const ok = await handleCheckout(data);
    if (ok) setShowPreForm(false);
  };
  const onEnquirySubmit = async (data: PreTourFormData): Promise<void> => {
    const ok = await handleEnquiry(data);
    if (ok) setShowEnquiryForm(false);
  };

  const openReserveForm = () => setShowPreForm(true);
  const openEnquiryForm = () => setShowEnquiryForm(true);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

      <IncludesSection />
      <TwoWaysSection
        privateFromPrice={privateFromPrice}
        groupFromPrice={groupFromPrice}
        defaultCurrency={defaultCurrency}
      />
      <TourFeaturedTours
        tours={tours}
        availability={availability}
        loading={toursLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        t={t}
        onSelectTour={setSelectedTour}
        onRequestCustom={() => scrollToId("private")}
      />
      <DestinationsSection destinations={derivedDestinations} loading={toursLoading} />
      <HowItWorksSection />
      <TourGroupSection
        groupTours={groupTours}
        availability={availability}
        loading={toursLoading}
        lang={lang}
        t={t}
        onJoinWaitlist={openEnquiryForm}
      />
      <TestimonialsSection />
      <PrivateTourSection
        variant="private"
        isSubmitting={isSubmittingPrivate}
        submitted={privateSubmitted}
        onSubmit={(payload) => submitInlineForm(payload, setIsSubmittingPrivate, setPrivateSubmitted)}
      />
      <WaitlistSection
        variant="waitlist"
        isSubmitting={isSubmittingWaitlist}
        submitted={waitlistSubmitted}
        onSubmit={(payload) => submitInlineForm(payload, setIsSubmittingWaitlist, setWaitlistSubmitted)}
      />
      <NewsletterSection t={t} />
      <TourFooter t={t} />

      <PreTourFormModal
        open={showPreForm}
        onOpenChange={setShowPreForm}
        onSubmit={onReserveSubmit}
        isSubmitting={isCheckingOut}
      />
      <PreTourFormModal
        open={showEnquiryForm}
        onOpenChange={setShowEnquiryForm}
        onSubmit={onEnquirySubmit}
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
