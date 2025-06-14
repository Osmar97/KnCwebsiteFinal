
import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AboutPage = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-14 sm:pt-16">
        <About />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default AboutPage;
