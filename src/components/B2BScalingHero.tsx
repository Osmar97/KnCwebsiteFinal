
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export const B2BScalingHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gold/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Flowing curves similar to the image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[300px] border-4 border-purple-300/30 rounded-l-full transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[250px] border-2 border-gold/40 rounded-l-full transform -rotate-6"></div>
        <div className="absolute bottom-20 right-10 w-[400px] h-[200px] border-2 border-white/20 rounded-l-full transform rotate-3"></div>
      </div>

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

            <Link to="/booking">
              <Button className="bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-600/50 font-medium tracking-wider px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                Book a call →
              </Button>
            </Link>
          </div>

          {/* Right side - decorative space for the curves */}
          <div className="hidden lg:block relative">
            <div className="w-full h-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
