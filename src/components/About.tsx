
import { Award, Target, Zap, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Strategic Focus",
      description: "We deliver targeted solutions that align with your business objectives and market opportunities."
    },
    {
      icon: Award,
      title: "Proven Excellence",
      description: "Our track record speaks for itself with consistently successful outcomes for our clients."
    },
    {
      icon: Zap,
      title: "Agile Execution",
      description: "We move quickly and efficiently, adapting to market changes and capitalizing on opportunities."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Our international experience provides clients with insights into global markets and trends."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-playfair text-navy-900 mb-6">
                About King & Company
              </h2>
              <div className="space-y-6 text-lg text-navy-600 leading-relaxed">
                <p>
                  Founded on the principle that strategic financial advisory should be both 
                  sophisticated and accessible, King & Company has established itself as a 
                  trusted partner for businesses seeking transformational growth.
                </p>
                <p>
                  Our team combines deep industry expertise with innovative financial strategies 
                  to help clients navigate complex markets, capitalize on opportunities, and 
                  achieve sustainable competitive advantages.
                </p>
                <p>
                  With over 25 years of collective experience across investment banking, 
                  corporate finance, and strategic consulting, we bring institutional-quality 
                  advisory services to companies at every stage of their growth journey.
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-4xl font-bold text-navy-900 font-playfair mb-2">98%</div>
                <div className="text-navy-600 font-medium">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-navy-900 font-playfair mb-2">$450M</div>
                <div className="text-navy-600 font-medium">Average Deal Size</div>
              </div>
            </div>
          </div>

          {/* Right Column - Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={value.title}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-playfair text-navy-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-navy-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leadership Quote */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl lg:text-3xl font-light font-playfair text-navy-900 mb-8 leading-relaxed italic">
              "Our success is measured not just by the transactions we complete, 
              but by the lasting relationships we build and the transformational 
              impact we create for our clients."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JK
              </div>
              <div className="text-left">
                <div className="font-semibold text-navy-900">John King</div>
                <div className="text-navy-600">Founder & Managing Partner</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
