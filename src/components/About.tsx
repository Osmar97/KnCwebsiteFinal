
import { AboutHero } from "./about/AboutHero";
import { AboutFoundation } from "./about/AboutFoundation";
import { AboutStats } from "./about/AboutStats";
import { AboutCTA } from "./about/AboutCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

export const About = () => {
  const { isVisible, scrolled, sectionRef } = useScrollAnimation(0.3);
  const countUp = useCountUp(isVisible);

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Company Introduction with Image */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left Column - Text Content */}
          <div>
            <AboutHero isVisible={isVisible} scrolled={scrolled} />
          </div>
          
          {/* Right Column - Image */}
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/7ddfc27e-5b82-4d8f-801e-a52772cc9d71.png" 
              alt="Beautiful property with pool and mountain view" 
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <AboutFoundation isVisible={isVisible} scrolled={scrolled} />
        <AboutStats isVisible={isVisible} countUp={countUp} />
        <AboutCTA isVisible={isVisible} />
      </div>
    </section>
  );
};
