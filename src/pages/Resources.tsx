
import { Navigation } from "@/components/Navigation";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <Testimonials />
        <Contact />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default ResourcesPage;
