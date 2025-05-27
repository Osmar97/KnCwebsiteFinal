
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Users, Quote, ArrowRight } from "lucide-react";

export const Team = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  const teamMembers = [
    {
      id: 1,
      name: "Ismael Reis",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      quote: "Transforming property ownership dreams into reality across Portugal and Cabo Verde",
      linkedin: "#",
      expertise: ["Market Analysis", "Investment Strategy", "Client Relations"]
    },
    {
      id: 2,
      name: "Sofia Martinez",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=400&fit=crop&crop=face",
      quote: "Excellence in execution, perfection in service delivery",
      linkedin: "#",
      expertise: ["Operations Management", "Process Optimization", "Team Leadership"]
    },
    {
      id: 3,
      name: "Carlos Silva",
      role: "Senior Investment Advisor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote: "Every investment tells a story of growth and opportunity",
      linkedin: "#",
      expertise: ["Investment Planning", "Market Research", "Financial Analysis"]
    }
  ];

  return (
    <section ref={sectionRef} id="team" className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-gold animate-pulse" />
            <span className="text-gold text-sm tracking-widest font-light">MEET THE EXPERTS</span>
            <Users className="w-6 h-6 text-gold animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
            OUR <span className="text-gold">TEAM</span>
          </h2>
          
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
          
          <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
            Meet the dedicated professionals who make property ownership dreams come true
          </p>
        </div>

        {/* Team Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {teamMembers.map((member, index) => (
            <Card 
              key={member.id}
              className={`bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 backdrop-blur-sm overflow-hidden group hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-0">
                {/* Member Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* LinkedIn Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <a 
                      href={member.linkedin}
                      className="w-10 h-10 bg-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-black" />
                    </a>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                  <p className="text-gold text-sm mb-4 font-light">{member.role}</p>
                  
                  {/* Quote */}
                  <div className="relative mb-6">
                    <Quote className="w-6 h-6 text-gold/30 mb-2" />
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{member.quote}"
                    </p>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-gold/20 text-gold text-xs rounded-full border border-gray-600/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-light text-white mb-4 tracking-wider">
                Ready to Work with the Best?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our team is here to guide you through every step of your property ownership journey. 
                Let's discuss how we can help you achieve your goals.
              </p>
              <Button 
                size="lg"
                className="bg-gold hover:bg-gold-light text-black font-medium tracking-wider px-8 py-3 transition-all duration-300 transform hover:scale-105 group"
                onClick={scrollToContact}
              >
                GET STARTED TODAY
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
