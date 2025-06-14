
import { AboutHero } from "./about/AboutHero";
import { AboutFoundation } from "./about/AboutFoundation";
import { AboutCTA } from "./about/AboutCTA";
import { TeamSection } from "./about/TeamSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const About = () => {
  const {
    isVisible,
    scrolled,
    sectionRef
  } = useScrollAnimation(0.3);
  
  return (
    <section ref={sectionRef} id="about" className="py-0 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AboutHero isVisible={isVisible} scrolled={scrolled} />
        <AboutFoundation isVisible={isVisible} scrolled={scrolled} />
        <TeamSection />
        <AboutCTA isVisible={isVisible} />
      </div>
    </section>
  );
};
