
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export const B2BScalingHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-gray-900 overflow-hidden">
      {/* Gradient overlay for smoother transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
              Transforming How<br />
              Business <span className="text-gold">B2B Scale</span>
            </h2>
            
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              The formula to <Rocket className="inline w-6 h-6 mx-1 text-gold" /> <span className="text-white font-medium">sky-rocket</span> your B2B company to success, by developing the best sales infrastructures and protocols whilst leveraging proven client acquisition systems.
            </p>

            <a href="https://kingsncompany.setmore.com/book?step=time-slot&products=020a7c7b-bdfe-468f-b339-44015db065a8&type=service&staff=1b7d6db9-90af-4ac1-b392-1f3eb6ec83d2&staffSelected=true" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gold/60 hover:bg-gold/70 text-white font-medium tracking-wider px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105">
                Book a call →
              </Button>
            </a>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/2ce9246f-9cf8-43b6-a057-365b64937d0f.png" 
                alt="Business meeting"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
