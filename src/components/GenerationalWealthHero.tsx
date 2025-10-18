import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const GenerationalWealthHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
            Build <span className="text-gold font-medium">Generational Wealth</span>
            <br />Through Property
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            Join successful entrepreneurs and investors who trust us to navigate the European and West African property markets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-6 text-lg">
                Schedule Consultation
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-6 text-lg">
                Explore Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
