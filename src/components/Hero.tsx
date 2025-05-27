import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import logo from '../assets/logo.png'; // Adjust path as needed

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on scroll position with smoother fade
  const backgroundOpacity = Math.max(0, 1 - scrollY / 800);

  const scrollToServices = () => {
    const contactSection = document.getElementById('services');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Animation with fade effect */}
    <div 
      className="absolute inset-0 transition-opacity duration-500 ease-out"
      style={{ opacity: backgroundOpacity }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" style={{
        transform: `translateY(${scrollY * 0.5}px)`
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      {/* Animated Background Image */}
      <div className="absolute inset-0 opacity-20 animate-slow-zoom" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translateY(${scrollY * 0.3}px)`
      }}></div>
    </div>

    {/* Floating Geometric Elements */}
    <div 
      className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
      style={{ opacity: backgroundOpacity }}
    >
      <div className="absolute top-20 left-10 w-32 h-32 border border-gold/20 rotate-45 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-gold/30 rotate-12 animate-float" style={{
        animationDelay: '2s'
      }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold/10 rotate-45 animate-float" style={{
        animationDelay: '4s'
      }}></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-gold/15 rounded-full animate-float" style={{
        animationDelay: '1s'
      }}></div>
    </div>

    {/* Main Content */}
    <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
      {/* Animated Logo */}
      <div className="flex justify-center mb-8 ">
        <img src={logo} alt="Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_10px_rgba(160,143,42,0.8)]" />
      </div>

      <div className="animate-fade-up">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wider">
          <span className="text-gold">KINGS 'N</span>
          <br />
          <span className="text-white">COMPANY</span>
        </h1>

        <p className="text-gold text-lg md:text-xl mb-4 tracking-widest font-light">
          REAL ESTATE NETWORK
        </p>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>

        <p className="text-gray-300 text-lg md:text-xl mb-3 max-w-3xl mx-auto leading-relaxed font-bold">Connecting Visionary Investors to Remarkable Properties</p>
        
        <p className="text-white text-xl mb-12 max-w-3xl mx-auto leading-relaxed md:text-base font-extralight py-[2px]">Welcome to Kings 'n Company</p>
      </div>

      {/* CTA Buttons */}
      
    </div>
  </section>;
};
