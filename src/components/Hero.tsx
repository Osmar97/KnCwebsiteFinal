
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold font-playfair text-navy-900 leading-tight">
                Strategic Financial
                <span className="text-primary block">Advisory</span>
              </h1>
              <p className="text-xl text-navy-600 leading-relaxed max-w-lg">
                Empowering businesses with sophisticated financial strategies, 
                investment banking expertise, and strategic advisory services 
                to drive exceptional growth and value creation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-4 group">
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-navy-900 font-playfair">$2.5B+</div>
                <div className="text-sm text-navy-600 font-medium">Assets Advised</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900 font-playfair">150+</div>
                <div className="text-sm text-navy-600 font-medium">Clients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-navy-900 font-playfair">25+</div>
                <div className="text-sm text-navy-600 font-medium">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative animate-slide-up">
            <div className="grid grid-cols-2 gap-6">
              {/* Feature Cards */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Growth Strategy</h3>
                  <p className="text-navy-600 text-sm">Strategic planning for sustainable business growth and market expansion.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mt-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">M&A Advisory</h3>
                  <p className="text-navy-600 text-sm">Expert guidance through mergers, acquisitions, and strategic partnerships.</p>
                </div>
              </div>

              <div className="space-y-6 pt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Risk Management</h3>
                  <p className="text-navy-600 text-sm">Comprehensive risk assessment and mitigation strategies for your business.</p>
                </div>

                <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl text-white">
                  <h3 className="text-lg font-semibold mb-2">Ready to Transform Your Business?</h3>
                  <p className="text-blue-100 text-sm mb-4">Join hundreds of successful companies that trust our expertise.</p>
                  <Button variant="secondary" size="sm">
                    Contact Us Today
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/5 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
