
interface AboutFoundationHeaderProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundationHeader = ({
  isVisible,
  scrolled
}: AboutFoundationHeaderProps) => {
  return (
    <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
          OUR <span className="text-gold">STATEMENT</span>
        </h2>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
        <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
          Our foundation is built on trust, excellence, and a commitment to creating lasting value in every partnership.
        </p>
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="relative overflow-hidden rounded-lg group">
          <img 
            src="/lovable-uploads/256987ad-785d-4df1-9323-ff450ee9cb3e.png" 
            alt="Professional team at Brasil Origem Week" 
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-lg font-light">Building strategic partnerships across international markets</p>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-lg group">
          <img 
            src="/lovable-uploads/a4eda20d-c71a-44cc-818c-5b9b3661c4ab.png" 
            alt="Strategic business discussion" 
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-lg font-light">Focused on meaningful connections and long-term success</p>
          </div>
        </div>
      </div>
    </div>
  );
};
