
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Calendar, Send, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const contactInfo = [
    {
      icon: Mail,
      label: "Direct Contact",
      value: "hello@kingsincompany.com",
      description: "Get a response within 24 hours"
    },
    {
      icon: Phone,
      label: "Consultation Line",
      value: "+351 XXX XXX XXX",
      description: "Available Mon-Fri, 9AM-6PM CET"
    },
    {
      icon: MapPin,
      label: "Service Areas",
      value: "Portugal & Cabo Verde",
      description: "Premium locations, premium service"
    },
 
  ];

  const serviceOptions = [
    "Property Ownership Academy",
    "Property Ownership Consultancy",
    "Property Ownership Tour",
    "Property Management",
    "General Inquiry"
  ];

  return (
    <section ref={sectionRef} id="resources" className="py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            <span className="text-gold text-sm tracking-widest font-light">LET'S CONNECT</span>
            <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
            BEGIN YOUR <span className="text-gold">JOURNEY</span>
          </h2>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
            Every extraordinary investment story begins with a conversation.
            <br />Let's start writing yours.
          </p>
        </div>

        <div className="flex justify-center  w-full px-4">
          {/* Contact Information */}
          <div className="w-full max-w-3xl ">
            <Card
              className={`bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700/50 backdrop-blur-sm transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <CardContent className="p-8 ">
                <h3 className="text-2xl font-light text-gold mb-8 tracking-wider flex items-center gap-3 justify-center">
                  <div className="w-8 h-0.5 bg-gold" />
                  CONNECT WITH US
                </h3>

                <div className="space-y-8 ">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className={`group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gold/5 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600/50 group-hover:border-gray-500/50 transition-colors">
                          <info.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1 tracking-wide">{info.label}</h4>
                          <p className="text-gold text-sm mb-1">{info.value}</p>
                          <p className="text-gray-400 text-xs">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};
