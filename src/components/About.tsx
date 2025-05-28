
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
        <AboutHero isVisible={isVisible} scrolled={scrolled} />
        
        {/* Company Introduction Section with Image */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <img 
                    src="/lovable-uploads/bf8148de-409a-4bd5-88c1-11dca2d5bdab.png" 
                    alt="Kings 'n Company Logo" 
                    className="mx-auto lg:mx-0 max-w-md w-full h-auto"
                  />
                </div>
                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed italic">
                  A real estate investment consultancy firm that seamlessly blends the strengths of regional market expertise 
                  with an expansive network of international investors and partners.
                </p>
              </div>
              
              {/* Image */}
              <div className="flex justify-center lg:justify-end">
                <img 
                  src="/lovable-uploads/a8a5c882-3315-404b-918c-2e215e999a2c.png" 
                  alt="Property with pool and mountain view" 
                  className="w-full max-w-lg h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        <AboutFoundation isVisible={isVisible} scrolled={scrolled} />
        <AboutStats isVisible={isVisible} countUp={countUp} />
        <AboutCTA isVisible={isVisible} />
      </div>
    </section>
  );
};
