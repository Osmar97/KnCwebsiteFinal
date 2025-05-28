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
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const getCardClassName = (size: string, index: number) => {
    const baseClasses = "group relative overflow-hidden transition-all duration-700 transform hover:scale-105";
    const visibilityClasses = visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
    if (size === "large") {
      return `${baseClasses} ${visibilityClasses} lg:col-span-2`;
    }
    return `${baseClasses} ${visibilityClasses}`;
  };
  return;
};