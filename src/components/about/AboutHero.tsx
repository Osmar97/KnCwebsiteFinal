
interface AboutHeroProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutHero = ({ isVisible, scrolled }: AboutHeroProps) => {
  return (
    <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-light mb-8 tracking-wider text-white">
            THE <span className="text-gold">COMPANY</span>
          </h1>
          <div className="max-w-4xl">
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light mb-4">
              Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
            </p>
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
              Building profitable, purposeful ventures across Portugal and Cabo Verde.
            </p>
          </div>
        </div>
        
        {/* Image */}
        <div className="flex justify-center lg:justify-end">
          <img 
            src="/lovable-uploads/a8a5c882-3315-404b-918c-2e215e999a2c.png" 
            alt="Property with pool and mountain view" 
            className="w-full max-w-lg h-auto rounded-lg shadow-2xl" 
          />
        </div>
      </div>
    </div>
  );
};
