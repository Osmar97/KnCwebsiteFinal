import HeroScrollContainer from "@/components/HeroScrollContainer";
import "@/components/HeroScrollContainer.css";

const HeroContent = () => {
  return null; // Nothing rendered
};

export const Hero = () => {
  const { scrollProgress, containerRef } = HeroScrollContainer({
    backgroundImage: "url('/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png')",
    textBlend: false,
    duration: 900,
  });

  return (
    <>
      {/* Visible hero section without scroll trapping */}
      <div ref={containerRef} className="hero-container relative w-full bg-black">
        {/* Background with fade based on scroll progress */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-700 ease-out"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 1.5) }}
        >
          <img
            src="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="w-full h-[100vh] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-90" />
        </div>

        {/* Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-gold/20 rotate-45 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-gold/30 rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold/10 rotate-45 animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-gold/15 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <img
                src="/lovable-uploads/1_Simbolo_Dourado.png"
                alt="Kings 'n Company gold symbol logo"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_10px_rgba(160,143,102,0.8)] mx-auto"
              />
            </div>

            {/* Title with proportional fade */}
            <div className="space-y-4">
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight">
                <span
                  className="block transition-opacity duration-700"
                  style={{ opacity: 1 - Math.min(scrollProgress * 0.8, 1) }}
                >
                  Connecting Visionary
                </span>
                <span
                  className="block text-gold transition-opacity duration-700"
                  style={{ opacity: 1 - Math.min((scrollProgress - 0.2) * 0.8, 1) }}
                >
                  Investors to Remarkable
                </span>
                <span
                  className="block text-white transition-opacity duration-700"
                  style={{ opacity: 1 - Math.min((scrollProgress - 0.4) * 0.8, 1) }}
                >
                  Properties
                </span>
              </h1>

              {/* Tagline with fade */}
              <p
                className="text-white/80 text-lg sm:text-xl md:text-2xl font-extralight tracking-wider transition-opacity duration-700"
                style={{ opacity: 1 - Math.min(scrollProgress, 1) }}
              >
                Welcome to Kings 'n Company
              </p>
            </div>

            {/* Scroll indicator - shows when scrolled past initial viewport */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500"
              style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)', opacity: scrollProgress > 0.3 ? 0 : 1 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/60 font-light">
                  Scroll Down
                </span>
                <div className="relative h-12 w-7 rounded-full border border-white/30 overflow-hidden backdrop-blur-sm">
                  <span className="absolute left-1/2 top-2 -translate-x-1/2 h-2 w-[2px] rounded-full bg-gold animate-scroll-dot-mobile" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hint for mobile users - partially visible next section */}
        {scrollProgress > 0.1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300">
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs text-white/40 font-light tracking-wider">
                Continue Scrolling
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* Sentinel element for navbar transparency - only placed if hero content exists */}
      <div data-hero-sentinel aria-hidden className="h-px w-full" />
    </>
  );
};
