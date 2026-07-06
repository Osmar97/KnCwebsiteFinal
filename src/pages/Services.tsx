
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PropertyOwnershipAcademy } from "@/components/services/PropertyOwnershipAcademy";
import { PropertyOwnershipConsultancy } from "@/components/services/PropertyOwnershipConsultancy";
import { PropertyOwnershipTour } from "@/components/services/PropertyOwnershipTour";
import { PropertyManagement } from "@/components/services/PropertyManagement";
import { CoInvestmentOpportunities } from "@/components/services/CoInvestmentOpportunities";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { GlobalCTA } from "@/components/GlobalCTA";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const ServicesPage = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "Services — Kings 'n Company";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">
      <Navigation />
      <div className="pt-[76px] sm:pt-20">
        <PropertyOwnershipAcademy />
        <PropertyOwnershipConsultancy />
        <PropertyOwnershipTour />
        <PropertyManagement />
        <CoInvestmentOpportunities />
      </div>
      <GlobalCTA />
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default ServicesPage;
