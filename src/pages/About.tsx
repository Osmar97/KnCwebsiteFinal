import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { GlobalCTA } from "@/components/GlobalCTA";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AboutPage = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "About Us — Kings 'n Company";
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-[76px] sm:pt-20">
        <About />
      </div>
      <GlobalCTA />
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default AboutPage;
