
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
        {/* Company Introduction with Image - Matching Reference Design */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Left Column - Text Content */}
          <div className="bg-black p-12 lg:p-16 flex flex-col justify-center min-h-[600px]">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-[0.2em] text-white">
                  THE <span className="italic">COMPANY</span>
                </h1>
                <div className="w-full h-px bg-gold mb-8"></div>
              </div>
              
              <div className="space-y-6">
                <p className="text-white text-lg md:text-xl leading-relaxed font-light">
                  Based in <span className="font-medium">Europe</span> and rooted in <span className="font-medium">West Africa</span>, we pride ourselves in connecting investors with the right properties, people, and opportunities.
                </p>
                
                <p className="text-white text-lg md:text-xl leading-relaxed font-light">
                  Building profitable, purposeful ventures across <span className="font-medium">Portugal</span> and <span className="font-medium">Cabo Verde</span>.
                </p>
              </div>
              
              {/* Geometric Logo Element */}
              <div className="pt-8">
                <div className="w-16 h-16 border border-gold/50">
                  <svg viewBox="0 0 64 64" className="w-full h-full stroke-gold/50 fill-none stroke-1">
                    <path d="M8 8 L32 32 L56 8 M8 56 L32 32 L56 56 M8 32 L56 32 M32 8 L32 56" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="relative min-h-[600px]">
            <img 
              src="/lovable-uploads/87b092af-d53b-4b8a-9220-2e766ab10ded.png" 
              alt="Luxury beachfront property with ocean view" 
              className="w-full h-full object-cover"
            />
            {/* Overlay Text */}
            <div className="absolute bottom-8 right-8 bg-black/70 text-white p-4 max-w-xs">
              <p className="text-sm font-light leading-relaxed">
                Connecting Visionary Investors to Remarkable Properties.
              </p>
            </div>
          </div>
        </div>

        <AboutFoundation isVisible={isVisible} scrolled={scrolled} />
        <AboutStats isVisible={isVisible} countUp={countUp} />
        <AboutCTA isVisible={isVisible} />
      </div>
    </section>
  );
};
