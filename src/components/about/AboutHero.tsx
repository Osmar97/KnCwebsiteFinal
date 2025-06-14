
interface AboutHeroProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutHero = ({ isVisible, scrolled }: AboutHeroProps) => {
  return (
    <div className={`mb-4 sm:mb-8 lg:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 lg:mb-6 tracking-wider text-white">
            THE <span className="text-gold">COMPANY</span>
          </h1>
          <div className="max-w-4xl">
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed font-light mb-2 sm:mb-3">
              Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
            </p>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed font-light">
              Building profitable, purposeful ventures across Portugal and Cabo Verde.
            </p>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex justify-center lg:justify-end mt-2 sm:mt-0">
          <img 
            src="/lovable-uploads/empresa.png" 
            alt="Property with pool and mountain view" 
            className="w-full max-w-lg h-auto rounded-lg shadow-2xl" 
          />
        </div>
      </div>
    </div>
  );
};
