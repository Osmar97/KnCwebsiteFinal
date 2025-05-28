
import { Navigation } from "@/components/Navigation";
import { RealEstateInvestmentBenefits } from "@/components/our-approach/RealEstateInvestmentBenefits";
import { Services } from "@/components/Services";
import { PropertyOwnershipAcademy } from "@/components/services/PropertyOwnershipAcademy";
import { PropertyOwnershipConsultancy } from "@/components/services/PropertyOwnershipConsultancy";
import { PropertyOwnershipTour } from "@/components/services/PropertyOwnershipTour";
import { PropertyManagement } from "@/components/services/PropertyManagement";
import { CoInvestmentOpportunities } from "@/components/services/CoInvestmentOpportunities";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <Services />
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
