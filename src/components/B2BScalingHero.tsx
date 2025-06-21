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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-tight">
              Property Ownership For Those Who 
              <span className="text-gold font-medium"> Think Beyond Borders</span>
            </h2>
            
            <div className="mb-8">
              <p className="text-white text-xl md:text-2xl font-light tracking-wide">
                From Lisbon to Cabo Verde — and beyond.
              </p>
            </div>
            
            <div className="relative mb-8">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-gold to-gold-light rounded-full"></div>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed pl-8 font-light">
                <span className="text-2xl mr-3">💡</span>
                <span className="text-white font-medium">Whether you're relocating, investing, or expanding your portfolio</span>, we help you cut through confusion and take action with confidence.
              </p>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed pl-8 mt-4 font-light">
                We combine <span className="text-gold font-medium">insider knowledge</span>, 
                <span className="text-gold font-medium"> hands-on support</span>, and a 
                <span className="text-gold font-medium"> global network</span> to make your property journey 
                <span className="text-white font-medium"> strategic, smooth, and profitable</span>.
              </p>
            </div>

            <Link to="/booking-form">
              <Button className="bg-gold/60 hover:bg-gold/70 text-white font-medium tracking-wider px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105">
                Book your strategic call →
              </Button>
            </Link>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/vista_troia.jpg" 
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
