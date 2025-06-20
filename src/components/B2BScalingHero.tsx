
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export const B2BScalingHero = () => {
  return (
    <section className="relative py-20 bg-black overflow-hidden">
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

            <Link to="/booking-form">
              <Button className="bg-gold/60 hover:bg-gold/70 text-white font-medium tracking-wider px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105">
                Book a call →
              </Button>
            </Link>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/ismaPerfil.JPG" 
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
