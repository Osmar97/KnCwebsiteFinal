import { useState, useCallback } from "react";
import { Navbar } from "@/kttc/components/landing/Navbar";
import { IntroLoader } from "@/kttc/components/landing/IntroLoader";
import { HeroSection } from "@/kttc/components/landing/HeroSection";
import { ProblemSection } from "@/kttc/components/landing/ProblemSection";
import { KTTCWaySection } from "@/kttc/components/landing/KTTCWaySection";
import { PlatformSection } from "@/kttc/components/landing/PlatformSection";
import { FounderSection } from "@/kttc/components/landing/FounderSection";
import { CTASection } from "@/kttc/components/landing/CTASection";
import { Footer } from "@/kttc/components/landing/Footer";
import { motion } from "framer-motion";

const Index = () => {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!loaderDone && <IntroLoader onComplete={handleLoaderComplete} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <KTTCWaySection />
        <PlatformSection />
        <FounderSection />
        <CTASection />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
