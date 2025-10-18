import { useState, useEffect } from "react";
import { AboutHero } from "./about/AboutHero";
import { AboutFoundation } from "./about/AboutFoundation";
import { AboutStats } from "./about/AboutStats";
import { TeamSection } from "./about/TeamSection";
import { AboutCTA } from "./about/AboutCTA";
import { useCountUp } from "@/hooks/useCountUp";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const countUp = useCountUp(isVisible);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-black text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutHero isVisible={isVisible} scrolled={scrolled} />
        <AboutFoundation isVisible={isVisible} scrolled={scrolled} />
        <AboutStats isVisible={isVisible} countUp={countUp} />
        <TeamSection />
        <AboutCTA isVisible={isVisible} />
      </div>
    </section>
  );
};
