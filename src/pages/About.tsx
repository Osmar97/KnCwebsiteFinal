
import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <About />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default AboutPage;
