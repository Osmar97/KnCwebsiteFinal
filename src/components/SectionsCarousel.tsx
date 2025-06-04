import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Target, Building, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const SectionsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sections = [{
    title: "ABOUT",
    subtitle: "Our Foundation",
    description: "Discover our mission, vision, and values that drive our commitment to excellence in real estate investment consulting.",
    icon: Target,
    href: "/about",
    gradient: "from-gold/20 to-gold-dark/20"
  }, {
    title: "SERVICES",
    subtitle: "Our Expertise",
    description: "Comprehensive real estate solutions from property ownership academy to complete investment consultancy and management.",
    icon: Building,
    href: "/services",
    gradient: "from-blue-500/20 to-blue-700/20"
  }, {
    title: "OUR APPROACH",
    subtitle: "Our Method",
    description: "Learn about our strategic methodology and proven processes that ensure successful real estate investments.",
    icon: MapPin,
    href: "/our-approach",
    gradient: "from-emerald-500/20 to-emerald-700/20"
  }, {
    title: "RESOURCES",
    subtitle: "Your Support",
    description: "Access testimonials from satisfied clients and get in touch with our expert team for personalized assistance.",
    icon: BookOpen,
    href: "/resources",
    gradient: "from-purple-500/20 to-purple-700/20"
  }];
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, sections.length]);
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % sections.length);
    setIsAutoPlaying(false);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + sections.length) % sections.length);
    setIsAutoPlaying(false);
  };
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">EXPLORE</span>
            <div className="w-12 h-0.5 bg-gold"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wider leading-tight">
            DISCOVER <span className="text-gold">OUR WORLD</span>
          </h2>

          <p className="text-gray-300 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Explore our comprehensive approach to real estate investment and discover how we can help you achieve your goals
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black">
            {sections.map((section, index) => {
            const isActive = index === currentSlide;
            const isPrev = index === (currentSlide - 1 + sections.length) % sections.length;
            const isNext = index === (currentSlide + 1) % sections.length;
            return <div key={index} className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 translate-x-0 scale-100' : isPrev ? 'opacity-50 -translate-x-full scale-95' : isNext ? 'opacity-50 translate-x-full scale-95' : 'opacity-0 translate-x-full scale-95'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient}`}></div>
                  
                  <div className="relative h-full flex items-center justify-center p-12">
                    <div className="text-center max-w-2xl">
                      <div className="mb-6">
                        <section.icon className="w-16 h-16 text-gold mx-auto mb-4" />
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-wider">
                        {section.title}
                      </h3>
                      
                      <p className="text-gold text-sm tracking-widest mb-6 uppercase">
                        {section.subtitle}
                      </p>
                      
                      <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                        {section.description}
                      </p>
                      
                      <Link to={section.href}>
                        <Button className="bg-gold hover:bg-gold-light text-black font-medium tracking-wider px-8 py-3 transition-all duration-300 transform hover:scale-105">
                          EXPLORE {section.title}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>;
          })}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide} 
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm border border-gold/30 hover:border-gold/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={nextSlide} 
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm border border-gold/30 hover:border-gold/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {sections.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-gold scale-125' : 'bg-gray-400 hover:bg-gray-600'}`} />)}
          </div>
        </div>

        {/* Auto-play Toggle */}
        
      </div>
    </section>
  );
};
