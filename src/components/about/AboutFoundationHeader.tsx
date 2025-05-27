
interface AboutFoundationHeaderProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundationHeader = ({ isVisible, scrolled }: AboutFoundationHeaderProps) => {
  return (
    <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="inline-flex items-center gap-2 mb-6">
        <div className="w-12 h-0.5 bg-gold"></div>
        <span className="text-gold text-sm tracking-widest font-light">WHO WE ARE</span>
        <div className="w-12 h-0.5 bg-gold"></div>
      </div>

      <h2 className={`text-4xl md:text-5xl font-light mb-8 tracking-wider leading-tight transition-colors duration-300 ${
        scrolled ? 'text-white' : 'text-white'
      }`}>
        OUR <span className={`transition-colors duration-300 ${scrolled ? 'text-white' : 'text-gold'}`}>FOUNDATION</span>
      </h2>
    </div>
  );
};
