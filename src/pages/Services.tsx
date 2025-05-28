
import { Navigation } from "@/components/Navigation";
import { RealEstateInvestmentBenefits } from "@/components/our-approach/RealEstateInvestmentBenefits";
import { PropertyOwnershipAcademy } from "@/components/services/PropertyOwnershipAcademy";
import { PropertyOwnershipConsultancy } from "@/components/services/PropertyOwnershipConsultancy";
import { PropertyOwnershipTour } from "@/components/services/PropertyOwnershipTour";
import { PropertyManagement } from "@/components/services/PropertyManagement";
import { CoInvestmentOpportunities } from "@/components/services/CoInvestmentOpportunities";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100">
      <Navigation />
      <div className="pt-16">
        <PropertyOwnershipAcademy />
        <PropertyOwnershipConsultancy />
        <PropertyOwnershipTour />
        <PropertyManagement />
        <RealEstateInvestmentBenefits />
        <CoInvestmentOpportunities />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default ServicesPage;
