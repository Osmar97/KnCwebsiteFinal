import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Building2, Shield } from "lucide-react";
export const Network = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const networkCategories = [{
    name: "Investment Funds",
    id: 1
  }, {
    name: "Lawyers",
    id: 2
  }, {
    name: "Insurance Brokers",
    id: 3
  }, {
    name: "Interior Designers",
    id: 4
  }, {
    name: "Hospitality Groups",
    id: 5
  }, {
    name: "Banks",
    id: 6
  }, {
    name: "Engineers",
    id: 7
  }, {
    name: "Architects",
    id: 8
  }, {
    name: "Builders",
    id: 9
  }, {
    name: "Private Investors",
    id: 10
  }, {
    name: "Business Consultants",
    id: 11
  }, {
    name: "Appraisers",
    id: 12
  }, {
    name: "Real Estate Agents",
    id: 13
  }, {
    name: "Property Managers",
    id: 14
  }, {
    name: "Financial Advisors",
    id: 15
  }, {
    name: "Tax Consultants",
    id: 16
  }, {
    name: "Accountants",
    id: 17
  }, {
    name: "Contractors",
    id: 18
  }, {
    name: "Market Analysts",
    id: 19
  }, {
    name: "Project Managers",
    id: 20
  }];
  const stats = [{
    icon: Users,
    value: "200+",
    label: "Network Partners"
  }, {
    icon: Building2,
    value: "15",
    label: "Industries Covered"
  }, {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate"
  }, {
    icon: Shield,
    value: "100%",
    label: "Vetted Professionals"
  }];

    const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };
  return <section ref={sectionRef} id="network" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '3s'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-8">
            <span className="text-gold text-sm tracking-widest font-light">THE COMPANY</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-wider leading-tight">
            OUR REAL ESTATE
            <br />
            <span className="text-gold">NETWORK</span>
          </h1>

          {/* Geometric Design Element */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border border-gold/30 transform rotate-12 rounded-lg"></div>
              <div className="absolute inset-2 border border-gold/50 transform -rotate-12 rounded-lg"></div>
              <div className="absolute inset-4 border border-gold transform rotate-45 rounded-lg"></div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-xl font-light leading-relaxed mb-4">
              An all-inclusive partnership ecosystem
            </p>
            <p className="text-gray-300 text-xl font-light leading-relaxed">
              tailored for property investors and owners, expanding daily.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => <div key={index} className="text-center group" style={{
          transitionDelay: `${index * 200}ms`
        }}>
              <div className="w-16 h-16 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600 group-hover:border-gold transition-all duration-300">
                <stat.icon className="w-8 h-8 text-gold" />
              </div>
              <div className="text-3xl font-light text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm tracking-wider">{stat.label}</div>
            </div>)}
        </div>

        {/* Network Grid */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 bg-gray-800/30 p-1 rounded-lg backdrop-blur-sm border border-gray-700">
            {networkCategories.map((category, index) => <Card key={category.id} className={`bg-gradient-to-br from-[#A08F66]/20 to-[#8B7A52]/10 border-gray-700 hover:border-gold/50 transition-all duration-500 cursor-pointer group ${hoveredCard === category.id ? 'scale-105 z-10' : ''}`} onMouseEnter={() => setHoveredCard(category.id)} onMouseLeave={() => setHoveredCard(null)} style={{
            transitionDelay: `${index * 50}ms`
          }}>
                <CardContent className="p-6 h-32 flex items-center justify-center text-center bg-stone-400">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <h3 className="text-white font-light tracking-wide text-sm leading-tight group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block p-8 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-lg border border-gray-700">
            <h3 className="text-2xl font-light text-gold mb-4 tracking-wider">Join Our Network</h3>
            <p className="text-gray-300 mb-6 max-w-2xl">
              Become part of our exclusive ecosystem of vetted professionals and expand your business opportunities.
            </p>
            <button onClick={scrollToContact} className="bg-gold hover:bg-gold-light text-black font-medium px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 tracking-wider">
              APPLY NOW
            </button>
          </div>
        </div>
      </div>
    </section>;
};