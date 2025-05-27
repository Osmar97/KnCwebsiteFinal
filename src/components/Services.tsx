import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, MapPin, Home, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
export const Services = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
          setVisibleCards(prev => [...prev, cardIndex]);
        }
      });
    }, {
      threshold: 0.3
    });
    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);


  const services = [{
    title: "PROPERTY OWNERSHIP ACADEMY",
    subtitle: "TAILORED EDUCATION",
    description: "Personalized 1:1 sessions for aspiring relocators and investors at every stage of their journey.",
    features: ["Clear explanations of legal, financial, and market realities", "Personalized guidance based on your specific goals", "Comprehensive tools, frameworks, and resources", "Perfect for early-stage investors and planners"],
    icon: Building,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    badge: "MOST POPULAR",
    size: "large"
  }, {
    title: "PROPERTY OWNERSHIP CONSULTANCY",
    subtitle: "END-TO-END SUPPORT",
    description: "Complete support for those ready to buy, rent, or invest. You bring the vision, we handle everything else.",
    features: ["Strategic planning based on your timeline", "Market research and property negotiations", "Trusted legal, banking, and renovation partners", "From first homes to investment portfolios"],
    icon: Users,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    badge: "PREMIUM",
    size: "medium"
  }, {
    title: "PROPERTY OWNERSHIP TOUR",
    subtitle: "IMMERSIVE EXPERIENCE",
    description: "Curated, premium experiences for quality insight and cultural immersion in record time.",
    features: ["Property visits with cultural immersion", "Complete itinerary and logistics handled", "Perfect for serious investors and relocators", "Expert guidance through Portugal or Cabo Verde"],
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    badge: "EXCLUSIVE",
    size: "medium"
  }, {
    title: "PROPERTY MANAGEMENT",
    subtitle: "HANDS-OFF OWNERSHIP",
    description: "Complete property management as if it were our own, whether you're abroad or simply prefer convenience.",
    features: ["Renovation coordination and management", "Long-term rental tenant services", "Complete maintenance oversight", "Regular reporting and updates"],
    icon: Home,
    image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80",
    badge: "ONGOING",
    size: "large"
  }];

  const scrollToContact = () => {
    // Check if we're on a page with contact section, otherwise navigate to resources
    const contactSection = document.getElementById('resources');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/resources';
    }
  };
 
  const getCardClassName = (size: string, index: number) => {
    const baseClasses = "group relative overflow-hidden transition-all duration-700 transform hover:scale-105";
    const visibilityClasses = visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
    if (size === "large") {
      return `${baseClasses} ${visibilityClasses} lg:col-span-2`;
    }
    return `${baseClasses} ${visibilityClasses}`;
  };
  return <section ref={sectionRef} id="services" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/10 to-transparent"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          <span className="text-gold text-sm tracking-widest font-light">PREMIUM SERVICES</span>
          <Sparkles className="w-6 h-6 text-gold animate-pulse" />
        </div>

        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
          OUR <span className="text-gold">EXPERTISE</span>
        </h2>

        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>

        <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
          Comprehensive real estate solutions crafted for discerning investors who demand excellence
        </p>
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-auto">
        {services.map((service, index) => <Card key={index} data-index={index} className={getCardClassName(service.size, index)} style={{
          transitionDelay: `${index * 200}ms`
        }}>
          <CardContent className="p-0 h-full bg-gray-950">
            <div className="relative h-80 overflow-hidden">
              {/* Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-gold text-black px-3 py-1 text-xs font-medium tracking-wider rounded-full">
                  {service.badge}
                </span>
              </div>

              {/* Image with Overlay */}
              <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Icon */}
              <div className="absolute top-4 right-4 z-20">
                <div className="w-12 h-12 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-gold/30">
                  <service.icon className="w-6 h-6 text-gold" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>

            <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-t border-gold/20">
              <h3 className="text-xl font-light text-gold mb-2 tracking-wider">
                {service.title}
              </h3>

              <p className="text-xs text-gray-400 tracking-widest mb-4 uppercase">
                {service.subtitle}
              </p>

              <p className="text-gray-300 mb-6 leading-relaxed font-light">
                {service.description}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start space-x-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <span className="font-light">{feature}</span>
                </li>)}
              </ul>

              <Button onClick={scrollToContact} variant="outline" className="w-full border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300 group-hover:border-gold">
                LEARN MORE
              </Button>
            </div>
          </CardContent>
        </Card>)}
      </div>
    </div>
  </section>;
};
