
import { useState, useEffect, useRef } from "react";
import { MapPin, Globe } from "lucide-react";

export const Markets = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0.1, // Reduced threshold for better mobile triggering
        rootMargin: '50px 0px' // Added margin for earlier triggering
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const portugalLocations = [
    {
      type: "PRIMARY LOCATIONS",
      locations: [
        {
          name: "Lisbon Metropolitan Area",
          description: "The vibrant heart of Portugal, encompassing the historic and bustling city of Lisbon and its surrounding areas."
        },
        {
          name: "Setúbal (Lisbon South Bay)",
          description: "A rapidly growing area south of Lisbon, known for its stunning coastline and increasing development opportunities."
        }
      ]
    },
    {
      type: "SECONDARY LOCATIONS",
      locations: [
        {
          name: "Porto and Douro Valley",
          description: "Northern Portugal's cultural hub and scenic wine region."
        },
        {
          name: "Silver Coast",
          description: "A picturesque coastal region between Lisbon and Porto, known for its beautiful beaches and historic towns."
        },
        {
          name: "Algarve",
          description: "Portugal's premier tourist destination, famed for its stunning beaches and high-end resorts."
        }
      ]
    }
  ];

  const caboVerdeLocations = [
    {
      name: "Sal Island",
      description: "Highly attractive for tourism-related investments due to its beautiful beaches, ideal climate for year-round tourism and growing popularity among international visitors."
    },
    {
      name: "São Vicente Island",
      description: "The vibrant cultural scape coupled with its strategic location as a port of call for cruise ships and a hub for music and arts festivals, makes it an appealing destination for investment in tourism infrastructure and residential projects."
    },
    {
      name: "Santiago Island",
      description: "Praia City's role as the economic and administrative center of Cabo Verde, coupled with its historical significance and growing urbanization, makes it a promising location for commercial, residential, and industrial developments."
    }
  ];

  return (
    <section ref={sectionRef} id="markets" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">OUR MARKETS</span>
            <div className="w-12 h-0.5 bg-gold"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wider leading-tight">
            WHERE WE <span className="text-gold">OPERATE</span>
          </h2>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Portugal Section */}
          <div className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '200ms' }}>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl overflow-hidden border border-gold/20 backdrop-blur-sm">
              {/* Portugal Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80"
                  alt="Portugal Landscape"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-gold" />
                  <h3 className="text-2xl font-light text-gold tracking-wider">PORTUGAL</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-8">
                  {portugalLocations.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-4">
                      <h4 className="text-gold text-sm tracking-widest font-medium">
                        {section.type}
                      </h4>
                      
                      <div className="space-y-4">
                        {section.locations.map((location, index) => (
                          <div 
                            key={index}
                            className={`p-4 bg-black/30 rounded-lg border border-gold/10 transition-all duration-600 ease-out hover:border-gold/30 ${
                              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{ transitionDelay: `${400 + (sectionIndex * 2 + index) * 100}ms` }}
                          >
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="text-white font-medium mb-2 tracking-wide">
                                  {location.name}
                                </h5>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {location.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cabo Verde Section */}
          <div className={`transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '400ms' }}>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl overflow-hidden border border-gold/20 backdrop-blur-sm">
              {/* Cabo Verde Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"
                  alt="Cabo Verde Beach"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <Globe className="w-8 h-8 text-gold" />
                  <h3 className="text-2xl font-light text-gold tracking-wider">CABO VERDE</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-6">
                  {caboVerdeLocations.map((location, index) => (
                    <div 
                      key={index}
                      className={`p-6 bg-black/30 rounded-lg border border-gold/10 transition-all duration-600 ease-out hover:border-gold/30 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="text-white font-medium mb-3 tracking-wide">
                            {location.name}
                          </h5>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`mt-16 text-center transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
          <div className="inline-flex items-center gap-4 text-gold/60">
            <div className="w-20 h-0.5 bg-gold/30"></div>
            <span className="text-xs tracking-widest">EXPANDING HORIZONS</span>
            <div className="w-20 h-0.5 bg-gold/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
