
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OurApproachHero } from "@/components/our-approach/OurApproachHero";
import { GlobalSupport } from "@/components/our-approach/GlobalSupport";
import { ExclusiveAccess } from "@/components/our-approach/ExclusiveAccess";
import { TailoredStrategies } from "@/components/our-approach/TailoredStrategies";
import { LongTermPartnership } from "@/components/our-approach/LongTermPartnership";
import { InvestorTimeline } from "@/components/our-approach/InvestorTimeline";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { GlobalCTA } from "@/components/GlobalCTA";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const OurApproachPage = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-[76px] sm:pt-20">
        <OurApproachHero />
        <GlobalSupport />
        <ExclusiveAccess />
        <TailoredStrategies />
        <LongTermPartnership />
        <InvestorTimeline />
      </div>
      <GlobalCTA />
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default OurApproachPage;
