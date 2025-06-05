import { MapPin, Plane, Camera, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const PropertyOwnershipTour = () => {
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

  const handleBookingClick = () => {
    window.open('https://kingsncompany.setmore.com/book?step=additional-products&products=814e33aa-9b10-43a4-8104-652ace5e0647&type=service&staff=1b7d6db9-90af-4ac1-b392-1f3eb6ec83d2&staffSelected=false', '_blank');
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
                className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl cursor-pointer"
                onClick={handleBookingClick}
              >
                <CardContent className="p-6 hover:bg-gray-50 transition-colors rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Start the Experience</p>
                      <p className="text-sm text-gray-600">Book Your Property Tour</p>
                    </div>
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