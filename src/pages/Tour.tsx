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
  DestinationsSection,
  HowItWorksSection,
  NewsletterSection,
} from "@/components/tour/TourStaticSections";
import { TourFeaturedTours } from "@/components/tour/TourFeaturedTours";
import { TourGroupSection } from "@/components/tour/TourGroupSection";
import { PrivateTourSection, WaitlistSection } from "@/components/tour/TourFormSections";
import { TourCTASection } from "@/components/tour/TourHeroCTA";

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TourPage() {
  useScrollToTop();

  const [lang, setLang] = useState<Language>("en");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [selectedTour, setSelectedTour] = useState<TourRow | null>(null);
  const { tours, availability, loading: toursLoading } = useTours();
  const { isSendingEnquiry, handleEnquiry, submitInlineForm } = useTourSubmissions();

  const t = (path: string) => {
    const keys = path.split(".");
    let obj: any = TRANSLATIONS[lang];
    for (const key of keys) obj = obj?.[key];
    return obj || path;
  };

  const onEnquirySubmit = async (data: PreTourFormData): Promise<void> => {
    const ok = await handleEnquiry(data);
    if (ok) setShowEnquiryForm(false);
  };

  const openEnquiryForm = () => setShowEnquiryForm(true);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Group-tour cards are now sourced from the database (tour_type === 'group').
  const groupTours = tours.filter((t) => t.tour_type === "group");

  // Destinations are derived from published tours. We deduplicate by the
  // primary destination + country so the section auto-updates whenever a new
  // tour is published from the admin dashboard.
  // Public Tours page surfaces only the two supported markets: Portugal and Cabo Verde.
  // We pick the first published tour we see for each country so the cards always render
  // with a real hero image while keeping the public list strictly limited.
  const PUBLIC_COUNTRIES = ["Portugal", "Cabo Verde"] as const;
  const derivedDestinations = (() => {
    const seen = new Set<string>();
    const out: { key: string; bgClass: string; country: string; name: string; detail: string }[] = [];
    tours.forEach((t) => {
      const primary = t.destinations?.[0];
      if (!primary) return;
      const country = countryFromFlag(t.flag);
      if (!PUBLIC_COUNTRIES.includes(country as typeof PUBLIC_COUNTRIES[number])) return;
      if (seen.has(country)) return;
      seen.add(country);
      const rest = (t.destinations || []).slice(1).join(" · ");
      out.push({
        key: country,
        bgClass: destBgClassFor(t.hero_image, t.flag),
        country,
        name: country,
        detail: rest || country,
      });
    });
    return out;
  })();

  return (
    <div className="tour-page">

      <TourTopNav lang={lang} setLang={setLang} t={t} />
      <TourHero t={t} />

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
      <DestinationsSection destinations={derivedDestinations} loading={toursLoading} t={t} />
      <TourCTASection t={t} />
      <HowItWorksSection t={t} />
      <TourGroupSection
        groupTours={groupTours}
        availability={availability}
        loading={toursLoading}
        lang={lang}
        t={t}
        onJoinWaitlist={openEnquiryForm}
      />
      <PrivateTourSection t={t} lang={lang} />
      <WaitlistSection
        variant="waitlist"
        isSubmitting={isSubmittingWaitlist}
        submitted={waitlistSubmitted}
        onSubmit={(payload) => submitInlineForm(payload, setIsSubmittingWaitlist, setWaitlistSubmitted)}
        t={t}
      />
      <IncludesSection t={t} />
      <TourCTASection t={t} />
      <NewsletterSection t={t} />
      <TourFooter t={t} />

      <PreTourFormModal
        open={showEnquiryForm}
        onOpenChange={setShowEnquiryForm}
        onSubmit={onEnquirySubmit}
        isSubmitting={isSendingEnquiry}
        mode="enquiry"
        t={t}
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
          perPerson: t("tour_modal.per_person"),
          joinWaitlist: t("tour_modal.join_waitlist"),
          close: t("tour_modal.close"),
          soldOut: t("tour_modal.sold_out"),
          days: (n) => String(t("tour_modal.days")).replace("{n}", String(n)),
        }}
      />
    </div>
  );
}
