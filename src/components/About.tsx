
import { Button } from "@/components/ui/button";
import { Award, Globe, Users, TrendingUp, Target, Eye, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countUp, setCountUp] = useState({ projects: 0, clients: 0, years: 0, satisfaction: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Animate counters
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;
          
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setCountUp({
              projects: Math.floor(150 * progress),
              clients: Math.floor(500 * progress),
              years: Math.floor(12 * progress),
              satisfaction: Math.floor(98 * progress)
            });
            
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: TrendingUp, label: "Properties Managed", value: countUp.projects, suffix: "+" },
    { icon: Users, label: "Happy Clients", value: countUp.clients, suffix: "+" },
    { icon: Globe, label: "Years Experience", value: countUp.years, suffix: "" },
    { icon: Award, label: "Satisfaction Rate", value: countUp.satisfaction, suffix: "%" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Integrity",
      description: "Do what's right, even when no one is watching."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Success is built through collaboration, shared purpose, and mutual respect."
    },
    {
      icon: Globe,
      title: "Empowerment",
      description: "Striving to leave a meaningful mark on our communities and future generations."
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Company Title and Description */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-wider">
            THE <span className="text-gold">COMPANY</span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light mb-4">
              Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
            </p>
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
              Building profitable, purposeful ventures across Portugal and Cape Verde.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">WHO WE ARE</span>
            <div className="w-12 h-0.5 bg-gold"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wider leading-tight">
            OUR <span className="text-gold">FOUNDATION</span>
          </h2>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left Column - Mission & Vision */}
          <div className={`space-y-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Mission */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Target className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-light text-gold tracking-wider">MISSION</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                We are committed to being your reliable allies in the real estate market, uncovering lucrative investments, 
                building consistent value, and assuring long-term returns.
              </p>
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Eye className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-light text-gold tracking-wider">VISION</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed font-light">
                To grow from a local enterprise to a global force, setting the benchmark in the real estate investment 
                industry in Portugal and West Africa.
              </p>
            </div>
          </div>

          {/* Right Column - Values */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Heart className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-light text-gold tracking-wider">VALUES</h3>
              </div>
              
              <div className="space-y-6">
                {values.map((value, index) => (
                  <div 
                    key={index}
                    className={`p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gold/20 transition-all duration-700 hover:border-gold/40 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${index * 150 + 400}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <value.icon className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-medium mb-2 tracking-wider">{value.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gold/20 transition-all duration-700 hover:border-gold/40"
            >
              <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="text-2xl font-light text-white mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-gray-400 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1000ms' }}>
          <Button 
            className="bg-gold hover:bg-gold-light text-black font-medium tracking-wider px-8 py-3 transition-all duration-300 transform hover:scale-105"
            onClick={scrollToContact}
          >
            BEGIN YOUR JOURNEY
          </Button>
        </div>
      </div>
    </section>
  );
};
