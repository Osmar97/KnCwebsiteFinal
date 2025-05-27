
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { OurApproachHero } from "@/components/our-approach/OurApproachHero";
import { InvestmentBenefits } from "@/components/our-approach/InvestmentBenefits";
import { PortfolioServices } from "@/components/our-approach/PortfolioServices";
import { GlobalSupport } from "@/components/our-approach/GlobalSupport";
import { ExclusiveAccess } from "@/components/our-approach/ExclusiveAccess";
import { TailoredStrategies } from "@/components/our-approach/TailoredStrategies";
import { LongTermPartnership } from "@/components/our-approach/LongTermPartnership";
import { TimelineProcess } from "@/components/our-approach/TimelineProcess";

const OurApproachPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <OurApproachHero />
        <InvestmentBenefits />
        <PortfolioServices />
        <GlobalSupport />
        <ExclusiveAccess />
        <TailoredStrategies />
        <LongTermPartnership />
        <TimelineProcess />
      </div>
      <Footer />
    </div>
  );
};

export default OurApproachPage;
