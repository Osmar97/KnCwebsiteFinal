
import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <Services />
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
