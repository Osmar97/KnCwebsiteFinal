
import { Target, Eye, Heart, Users, Globe } from "lucide-react";

interface AboutFoundationProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundation = ({ isVisible, scrolled }: AboutFoundationProps) => {
  const values = [
    {
      icon: Heart,
      title: "Integrity",
      description: "Do what's right, even when no one is watching."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Success is built through collaboration, shared purpose, and mutual respect."
    },
    {
      icon: Globe,
      title: "Empowerment",
      description: "Striving to leave a meaningful mark on our communities and future generations."
    }
  ];

  return (
    <>
      {/* Header */}
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

      {/* Mission, Vision, Values Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
        {/* Left Column - Mission & Vision */}
        <div className={`space-y-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          {/* Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-gold" />
              <h3 className="text-2xl font-light text-gold tracking-wider">MISSION</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              We are committed to being your reliable allies in the real estate market, uncovering lucrative investments, 
              building consistent value, and assuring long-term returns.
            </p>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Eye className="w-8 h-8 text-gold" />
              <h3 className="text-2xl font-light text-gold tracking-wider">VISION</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              To grow from a local enterprise to a global force, setting the benchmark in the real estate investment 
              industry in Portugal and West Africa.
            </p>
          </div>
        </div>

        {/* Right Column - Values */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Heart className="w-8 h-8 text-gold" />
              <h3 className="text-2xl font-light text-gold tracking-wider">VALUES</h3>
            </div>
            
            <div className="space-y-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className={`p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gold/20 transition-all duration-700 hover:border-gold/40 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 150 + 400}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <value.icon className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-2 tracking-wider">{value.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
