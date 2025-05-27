
interface AboutHeroProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutHero = ({ isVisible, scrolled }: AboutHeroProps) => {
  return (
    <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <h1 className={`text-5xl md:text-6xl font-light mb-8 tracking-wider transition-colors duration-300 ${
        scrolled ? 'text-white' : 'text-white'
      }`}>
        THE <span className={`transition-colors duration-300 ${scrolled ? 'text-white' : 'text-gold'}`}>COMPANY</span>
      </h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light mb-4">
          Based in Europe and rooted in West Africa, we pride ourselves in connecting investors with the right properties, people, and opportunities.
        </p>
        <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-light">
          Building profitable, purposeful ventures across Portugal and Cape Verde.
        </p>
      </div>
    </div>
  );
};
