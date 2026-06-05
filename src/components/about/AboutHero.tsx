
interface AboutHeroProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutHero = ({ isVisible, scrolled }: AboutHeroProps) => {
  return (
    <div className={`mb-0 sm:mb-4 lg:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-2 sm:mb-3 lg:mb-4 tracking-wider text-white">
            About Kings 'n Company — Real Estate Investment in <span className="text-gold">Portugal and Cabo Verde</span>
          </h1>
          <div className="max-w-4xl">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-light mb-1 sm:mb-2">
              Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
            </p>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-light">
              Building profitable, purposeful ventures across Portugal and Cabo Verde.
            </p>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex justify-center lg:justify-end mt-1 sm:mt-0">
          <img 
            src="/lovable-uploads/empresa.png" 
            alt="Luxury Kings 'n Company property with pool and mountain view in Portugal" 
            className="w-full max-w-lg h-auto rounded-lg shadow-2xl" 
          />
        </div>
      </div>
      <div data-hero-sentinel aria-hidden className="h-px w-full" />
    </div>
  );
};
