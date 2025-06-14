
interface AboutHeroProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutHero = ({ isVisible, scrolled }: AboutHeroProps) => {
  return (
    <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 lg:mb-8 tracking-wider text-white">
            THE <span className="text-gold">COMPANY</span>
          </h1>
          <div className="max-w-4xl">
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed font-light mb-3 sm:mb-4">
              Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
            </p>
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed font-light">
              Building profitable, purposeful ventures across Portugal and Cabo Verde.
            </p>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex justify-center lg:justify-end mt-4 sm:mt-0">
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
