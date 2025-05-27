
import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Markets } from "@/components/Markets";
import { Network } from "@/components/Network";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import logo from '../assets/logo.png';

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Wait for fade out animation to complete
    }, 2500); // Show loader for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return (
      <div 
        className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-1000 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center space-y-6 animate-fade-up">
          <img 
            src={logo} 
            alt="Kings 'n Company Logo" 
            className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(160,143,102,0.8)] animate-glow" 
          />
          <div className="text-center">
            <h1 className="text-4xl font-light text-gold tracking-wider">
              Kings 'n Company
            </h1>
            <p className="text-sm text-gray-400 tracking-widest mt-2">
              REAL ESTATE NETWORK
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Markets />
      <Network />
      <Team />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
