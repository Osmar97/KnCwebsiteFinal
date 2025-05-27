
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OurApproachHero } from "@/components/our-approach/OurApproachHero";
import { RealEstateInvestmentBenefits } from "@/components/our-approach/RealEstateInvestmentBenefits";
import { CoreServices } from "@/components/our-approach/CoreServices";
import { GlobalSupport } from "@/components/our-approach/GlobalSupport";
import { ExclusiveAccess } from "@/components/our-approach/ExclusiveAccess";
import { TailoredStrategies } from "@/components/our-approach/TailoredStrategies";
import { LongTermPartnership } from "@/components/our-approach/LongTermPartnership";
import { InvestorTimeline } from "@/components/our-approach/InvestorTimeline";

const OurApproachPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <OurApproachHero />
        <RealEstateInvestmentBenefits />
        <CoreServices />
        <GlobalSupport />
        <ExclusiveAccess />
        <TailoredStrategies />
        <LongTermPartnership />
        <InvestorTimeline />
      </div>
      <Footer />
    </div>
  );
};

export default OurApproachPage;
