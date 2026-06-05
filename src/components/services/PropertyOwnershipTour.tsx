import { MapPin, Plane, Camera, Globe, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { openInNewTab } from "@/lib/openLink";
import { useNavigate } from "react-router-dom";

export const PropertyOwnershipTour = () => {
  const navigate = useNavigate();

  const highlights = [{
    icon: MapPin,
    title: "Property Visits",
    description: "Curated property visits with cultural immersion experiences"
  }, {
    icon: Plane,
    title: "Complete Logistics",
    description: "Full itinerary planning and logistics management"
  }, {
    icon: Camera,
    title: "Market Insights",
    description: "Deep dive into local markets with expert guidance"
  }, {
    icon: Globe,
    title: "Cultural Experience",
    description: "Authentic cultural immersion in Portugal and Cabo Verde"
  }];

  const handleBookingClick = (fallbackMessage?: string) => {
    openInNewTab("/POT", { navigate, fallbackMessage });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wider">
              PROPERTY OWNERSHIP <span className="text-gold">TOUR</span>
            </h2>

            <div className="w-24 h-0.5 bg-gradient-to-r from-gold to-transparent mb-8"></div>

            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Curated, premium experiences for quality insight and cultural immersion in record time. 
              Perfect for serious investors and relocators.
            </p>

            <p className="text-gray-400 mb-12 leading-relaxed">
              Our exclusive tours provide unparalleled access to premium properties while offering 
              deep cultural insights into Portugal and Cabo Verde markets.
            </p>

            {/* Highlights Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{highlight.title}</h3>
                    <p className="text-gray-400 text-sm">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Card
                className="group w-full md:w-auto bg-[#FAFAFA]/90 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-gold/20 rounded-2xl cursor-pointer transition-all duration-400 ease-out hover:-translate-y-1.5 hover:bg-white/95"
                onClick={() => handleBookingClick()}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-400">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 tracking-wide group-hover:text-gold transition-colors duration-400">Start the Experience</p>
                        <p className="text-sm text-gray-500 font-light">Plan Your Tour</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img src="/lovable-uploads/Portugal.HEIC" alt="Luxury Property Tour - Coastal Development" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <Card className="bg-gold/10 backdrop-blur-sm border border-gold/20">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-gold mb-1">Portugal</div>
                  <div className="text-sm text-gray-300">Solidified Markets</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4 mt-8">
              <Card className="bg-gold/10 backdrop-blur-sm border border-gold/20">
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-gold mb-1">Cabo Verde</div>
                  <div className="text-sm text-gray-300">Emerging Markets</div>
                </CardContent>
              </Card>
              
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img src="/lovable-uploads/Caboverde.HEIC" alt="Property Tour - Coastal Development" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};