
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Users, Instagram } from "lucide-react";

export const TeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const teamMembers = [{
    id: 1,
    name: "Ismael Gomes Queta",
    role: "Founder & CEO",
    experience: "4 years in the real estate industry",
    image: "/lovable-uploads/IsmaelTeam.png",
    quote: "My mission is to create valuable connections and long-term wealth for our clients, guiding them through one of the most impactful decisions of their lives.",
    linkedin: "https://pt.linkedin.com/in/ismaelgq",
    instagram: "https://www.instagram.com/ismaelgq_/profilecard/?igsh=ZWloM3JwdTE4aWgz",
    flagEmoji: "🇬🇼" // Guinea-Bissau flag
  }, {
    id: 2,
    name: "Nuno Andrade",
    role: "Investment Consultant",
    experience: "8 years in the real estate industry",
    image: "/lovable-uploads/2.png",
    quote: "I believe in delivering solid, data-driven insights to help investors make the most strategic decisions possible.",
    linkedin: "https://www.linkedin.com/in/nuno-miguel-andrade-monteiro-b37509a5/",
    flagEmoji: "🇨🇻" // Cape Verde flag
  }, {
    id: 3,
    name: "Daniela Oliveira",
    role: "Client Operations Manager",
    experience: "5 years in client operations",
    image: "/lovable-uploads/0e951407-727d-4275-979f-2fd779d59773.png",
    quote: "I ensure every client receives exceptional service and support throughout their property ownership journey.",
    linkedin: "#",
    flagEmoji: "🇨🇻" // Cape Verde flag
  }];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '3s'
        }}></div>
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {teamMembers.map((member, index) => (
            <Card key={member.id} className={`bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 backdrop-blur-sm overflow-hidden group hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
              transitionDelay: `${index * 200}ms`
            }}>
              <CardContent className="p-0">
                {/* Member Image */}
                <div className="relative overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-80 object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Social Media Icons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                      <Linkedin className="w-6 h-6 text-black" />
                    </a>
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                        <Instagram className="w-6 h-6 text-black" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-8">
                  <h3 className="text-2xl font-medium text-white mb-2 tracking-wide">{member.name}</h3>
                  <p className="text-gold text-lg mb-2 font-light">{member.role}</p>
                  
                  {/* Quote with Flag */}
                  <div className="relative mb-6">
                    <div className="flex items-center mb-3">
                      <span className="text-3xl mr-2">{member.flagEmoji}</span>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed italic pl-4 border-l-2 border-gold/30">
                      "{member.quote}"
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
